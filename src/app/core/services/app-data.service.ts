import { Injectable, inject, computed } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { Prompt } from "../../features/prompts/prompt";
import { NavigationItem } from "../../features/navigation/navigation-item";

export type DataSource = "local" | "firestore";

@Injectable({
    providedIn: "root",
})
export class AppDataService {
    private firestoreService = inject(FirestoreService);

    public prompts = computed<Prompt[]>(() => this.firestoreService.prompts());

    public categories = computed<NavigationItem[]>(() =>
        this.mapFirestoreCategoriesToNavigationItems()
    );

    public tags = computed<NavigationItem[]>(() => this.mapFirestoreTagsToNavigationItems());

    public isLoading = computed<boolean>(() => this.firestoreService.isLoading());

    public error = computed<string | null>(() => this.firestoreService.error());

    /**
     * Buscar prompts
     */
    search(searchTerm: string, enableFuzzy: boolean = true): Promise<ResultadoBusqueda> {
        return this.searchInFirestore(searchTerm, enableFuzzy);
    }

    /**
     * Obtener prompts por categoría
     */
    async byCategory(slug: string): Promise<{ name: string; prompts: Prompt[] }> {
        const category = this.firestoreService.getCategoryBySlug(slug);

        return category.then(async (category) => {
            if (!category) {
                throw new Error(`No se encontró la categoría '${slug}'.`);
            }

            const prompts = await this.firestoreService.getPromptsByCategory(category.name);
            return { name: this.titleCase(category.name), prompts };
        });
    }

    async byTag(slug: string): Promise<{ name: string; prompts: Prompt[] }> {
        const tag = this.firestoreService.getTagBySlug(slug);

        return tag.then(async (tag) => {
            if (!tag) {
                throw new Error(`No se encontró la categoría '${slug}'.`);
            }

            const prompts = await this.firestoreService.getPromptsByTag(tag.name);
            return { name: this.titleCase(tag.name), prompts };
        });
    }

    /**
     * Obtener prompt por slug/ID
     */
    async byId(slug: string): Promise<Prompt> {
        const prompt = await this.firestoreService.getPromptById(slug);
        if (!prompt) {
            throw new Error(`No se encontró un prompt '${slug}'.`);
        }
        return prompt;
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

export type ResultadoBusqueda = {
    search: string;
    found: { item: Prompt; foundIn: foundInKey; position: number; relevanceScore: number }[];
};

export type foundInKey = "titulo" | "prompt" | "descripcion" | "autor" | "categoria" | "tags";

export type ListPrompts = { name: string; prompts: Prompt[] };
