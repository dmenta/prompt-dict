import { Injectable, inject, signal, computed } from "@angular/core";
import { DataService } from "./data.service";
import { FirestoreService } from "./firestore.service";
import { Prompt } from "../../features/prompts/prompt";
import { NavigationItem } from "../../features/navigation/navigation-item";
import { ResultadoBusqueda } from "./data.service";

export type DataSource = "local" | "firestore";

/**
 * Servicio unificado que puede alternar entre datos locales y Firestore
 */
@Injectable({
    providedIn: "root",
})
export class AppDataService {
    private dataService = inject(DataService);
    private firestoreService = inject(FirestoreService);

    // Signal para controlar la fuente de datos
    public dataSource = signal<DataSource>("local");

    // Signals que se actualizan según la fuente de datos activa
    public prompts = computed<Prompt[]>(() => {
        return this.dataSource() === "local"
            ? this.dataService.prompts()
            : this.firestoreService.prompts();
    });

    public categories = computed<NavigationItem[]>(() => {
        return this.dataSource() === "local"
            ? this.dataService.categories()
            : this.mapFirestoreCategoriesToNavigationItems();
    });

    public tags = computed<NavigationItem[]>(() => {
        return this.dataSource() === "local"
            ? this.dataService.tags()
            : this.mapFirestoreTagsToNavigationItems();
    });

    public isLoading = computed<boolean>(() => {
        return this.dataSource() === "firestore" ? this.firestoreService.isLoading() : false;
    });

    public error = computed<string | null>(() => {
        return this.dataSource() === "firestore" ? this.firestoreService.error() : null;
    });

    // Métodos de la API unificada

    /**
     * Cambiar la fuente de datos
     */
    switchToFirestore(): void {
        this.dataSource.set("firestore");
    }

    switchToLocal(): void {
        this.dataSource.set("local");
    }

    constructor() {
        this.switchToFirestore();
    }

    /**
     * Buscar prompts
     */
    search(searchTerm: string, enableFuzzy: boolean = true): Promise<ResultadoBusqueda> {
        if (this.dataSource() === "local") {
            return Promise.resolve(this.dataService.search(searchTerm, enableFuzzy));
        } else {
            // Para Firestore, necesitamos adaptar el resultado
            return this.searchInFirestore(searchTerm, enableFuzzy);
        }
    }

    /**
     * Obtener prompts por categoría
     */
    async byCategory(slug: string): Promise<{ name: string; prompts: Prompt[] }> {
        if (this.dataSource() === "local") {
            return this.dataService.byCategory(slug);
        } else {
            // Buscar la categoría en Firestore
            const category = this.firestoreService.getCategoryBySlug(slug);

            return category.then(async (category) => {
                if (!category) {
                    throw new Error(`No se encontró la categoría '${slug}'.`);
                }

                const prompts = await this.firestoreService.getPromptsByCategory(category.name);
                return { name: this.titleCase(category.name), prompts };
            });
        }
    }

    async byTag(slug: string): Promise<{ name: string; prompts: Prompt[] }> {
        if (this.dataSource() === "local") {
            return this.dataService.byTag(slug);
        } else {
            // Buscar la categoría en Firestore
            const tag = this.firestoreService.getTagBySlug(slug);

            return tag.then(async (tag) => {
                if (!tag) {
                    throw new Error(`No se encontró la categoría '${slug}'.`);
                }

                const prompts = await this.firestoreService.getPromptsByTag(tag.name);
                return { name: this.titleCase(tag.name), prompts };
            });
        }
    }

    /**
     * Obtener prompt por slug/ID
     */
    async byId(slug: string): Promise<Prompt> {
        if (this.dataSource() === "local") {
            return this.dataService.byId(slug);
        } else {
            // En Firestore, necesitaremos buscar por slug o usar ID directo
            const prompt = await this.firestoreService.getPromptById(slug);
            if (!prompt) {
                throw new Error(`No se encontró un prompt '${slug}'.`);
            }
            return prompt;
        }
    }

    /**
     * Migrar datos locales a Firestore
     */
    async migrateToFirestore(): Promise<boolean> {
        const localPrompts = this.dataService.prompts();
        if (localPrompts.length === 0) {
            console.warn("No hay datos locales para migrar");
            return false;
        }

        const success = await this.firestoreService.migrateLocalData(localPrompts);
        if (success) {
            console.log("Migración completada, cambiando a Firestore...");
            this.switchToFirestore();
        }
        return success;
    }

    // Métodos privados

    private async searchInFirestore(
        searchTerm: string,
        enableFuzzy: boolean
    ): Promise<ResultadoBusqueda> {
        try {
            const prompts = await this.firestoreService.searchPrompts(searchTerm);

            // Adaptar el resultado al formato esperado
            const found = prompts.map((prompt) => ({
                item: prompt,
                foundIn: "titulo" as const, // Simplificado para Firestore
                position: 0,
                relevanceScore: 1.0,
            }));

            return {
                search: searchTerm,
                found,
            };
        } catch (error) {
            console.error("Error en búsqueda de Firestore:", error);
            return {
                search: searchTerm,
                found: [],
            };
        }
    }

    private mapFirestoreCategoriesToNavigationItems(): NavigationItem[] {
        return this.firestoreService.categories().map((cat) => ({
            text: cat.name,
            slug: cat.slug,
            cantidad: cat.prompt_count,
            prompts: [],
        }));
    }

    private mapFirestoreTagsToNavigationItems(): NavigationItem[] {
        return this.firestoreService.tags().map((tag) => ({
            text: tag.name,
            slug: tag.slug,
            cantidad: tag.prompt_count,
            prompts: [],
        }));
    }

    private titleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}
