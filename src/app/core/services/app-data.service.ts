import { Injectable, inject } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { Prompt, AddPrompt } from "../models";

@Injectable({
    providedIn: "root",
})
export class AppDataService {
    private firestoreService = inject(FirestoreService);

    /**
     * Buscar prompts
     */
    search(searchTerm: string) {
        return this.searchInFirestore(searchTerm);
    }

    /**
     * Obtener categorías
     */
    prompts() {
        return this.firestoreService.prompts();
    }

    async byCategoryName(name: string) {
        return {
            name: this.titleCase(name),
            prompts: await this.firestoreService.getPromptsByCategory(name),
        };
    }

    async byTagName(name: string) {
        return {
            name: this.titleCase(name),
            prompts: await this.firestoreService.getPromptsByTag(name),
        };
    }

    /**
     * Crear un nuevo prompt y actualizar tags/categoría
     */
    async createPrompt(prompt: AddPrompt) {
        await this.firestoreService.createPrompt(prompt).then((id) => {
            this.addOrUpdateCategory(prompt.categoria);
            this.addOrUpdateTags(prompt.tags);
        });
    }

    /**
     * Actualizar o crear tags/categoría con prompt_count
     */
    async addOrUpdateCategory(categoria: string) {
        const count = this.prompts().filter((p) => p.categoria === categoria.toLowerCase()).length;
        console.log("Count for category:", categoria.toLowerCase(), count);
        if (count > 1) {
            await this.firestoreService.updateCategoryPromptCount(
                categoria.toLowerCase(),
                count + 1
            );
        } else {
            await this.firestoreService.createCategory({
                name: categoria.toLowerCase(),
                prompt_count: 1,
                slug: "",
            });
        }
    }

    addOrUpdateTags(tags: string[]) {
        tags.forEach(async (tag) => {
            const count = this.prompts().filter((p) => p.tags.includes(tag.toLowerCase())).length;
            console.log("Count for tag:", tag.toLowerCase(), count);
            if (count > 1) {
                await this.firestoreService.updateTagPromptCount(tag.toLowerCase(), count + 1);
            } else {
                await this.firestoreService.createTag({
                    name: tag.toLowerCase(),
                    prompt_count: 1,
                    slug: "",
                });
            }
        });
    }

    async updateOrDeleteCategory(categoria: string) {
        const count = this.prompts().filter((p) => p.categoria === categoria.toLowerCase()).length;
        console.log("Count for category:", categoria.toLowerCase(), count);
        if (count > 0) {
            await this.firestoreService.updateTagPromptCount(categoria.toLowerCase(), count + 1);
        } else {
            await this.firestoreService.deleteCategory(categoria.toLowerCase());
        }
    }

    async updateOrDeleteTags(tags: string[]) {
        tags.forEach(async (tag) => {
            const count = this.prompts().filter((p) => p.tags.includes(tag.toLowerCase())).length;
            console.log("Count for tag:", tag.toLowerCase(), count);
            if (count > 0) {
                await this.firestoreService.updateTagPromptCount(tag.toLowerCase(), count + 1);
            } else {
                await this.firestoreService.deleteTag(tag.toLowerCase());
            }
        });
    }

    /** Eliminar prompt */
    async deletePrompt(id: string) {
        const prompt = this.firestoreService.getPromptById(id)!;

        const tags = [...prompt.tags];
        const category = prompt.categoria;

        await this.firestoreService.deletePrompt(id).then(() => {
            this.updateOrDeleteCategory(category);
            this.updateOrDeleteTags(tags);
        });
    }

    async deleteTag(name: string) {
        await this.firestoreService.deleteTag(name.toLowerCase());
    }

    async deleteCategory(name: string) {
        await this.firestoreService.deleteCategory(name.toLowerCase());
    }

    /**
     * Obtener prompt por slug
     */
    async bySlug(slug: string) {
        return this.firestoreService.getPromptBySlug(slug);
    }

    // Métodos privados

    private searchInFirestore(searchTerm: string) {
        try {
            const found = this.firestoreService.searchPrompts(searchTerm).map((prompt) => {
                // Adaptar el resultado al formato esperado
                return {
                    item: prompt,
                    foundIn: "titulo" as const, // Simplificado para Firestore
                    position: 0,
                    relevanceScore: 1.0,
                };
            });

            return {
                search: searchTerm,
                found,
            };
        } catch (error) {
            console.error("Error en búsqueda de Firestore:", error);
            return {
                search: searchTerm,
                found: [] as {
                    item: Prompt;
                    foundIn: foundInKey;
                    position: number;
                    relevanceScore: number;
                }[],
            };
        }
    }
    private titleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

export type ResultadoBusqueda = {
    search: string;
    found: {
        item: Prompt;
        foundIn: foundInKey;
        position: number;
        relevanceScore: number;
    }[];
};

type foundInKey = "titulo" | "prompt" | "descripcion" | "autor" | "categoria" | "tags";

export type ListPrompts = { name: string; prompts: Prompt[] };
