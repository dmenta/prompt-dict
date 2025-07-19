import { Injectable, inject, computed } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { NavigationItem } from "../../features/navigation/navigation-item";
import { FirestorePrompt } from "../models";

@Injectable({
    providedIn: "root",
})
export class AppDataService {
    private firestoreService = inject(FirestoreService);

    public prompts = computed<FirestorePrompt[]>(() => this.firestoreService.prompts());

    public categories = computed<NavigationItem[]>(() => this.firestoreService.categories());

    public tags = computed<NavigationItem[]>(() => this.firestoreService.tags());

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
    async byCategory(slug: string): Promise<{ name: string; prompts: FirestorePrompt[] }> {
        const category = this.firestoreService.getCategoryBySlug(slug);

        return category.then(async (category) => {
            if (!category) {
                throw new Error(`No se encontró la categoría '${slug}'.`);
            }

            const prompts = await this.firestoreService.getPromptsByCategory(category.name);
            return { name: this.titleCase(category.name), prompts };
        });
    }

    async byTag(slug: string): Promise<{ name: string; prompts: FirestorePrompt[] }> {
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
    async byId(slug: string): Promise<FirestorePrompt> {
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

    private titleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

type ResultadoBusqueda = {
    search: string;
    found: {
        item: FirestorePrompt;
        foundIn: foundInKey;
        position: number;
        relevanceScore: number;
    }[];
};

type foundInKey = "titulo" | "prompt" | "descripcion" | "autor" | "categoria" | "tags";

export type ListPrompts = { name: string; prompts: FirestorePrompt[] };
