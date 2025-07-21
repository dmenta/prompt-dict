import { Injectable, inject, computed } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { FirestorePrompt, FirestoreCategory, FirestoreTag, AddPrompt } from "../models";

@Injectable({
    providedIn: "root",
})
export class AppDataService {
    private firestoreService = inject(FirestoreService);

    public error = computed<string | null>(() => this.firestoreService.error());

    /**
     * Buscar prompts
     */
    search(searchTerm: string, enableFuzzy: boolean = true): Promise<ResultadoBusqueda> {
        return this.searchInFirestore(searchTerm, enableFuzzy);
    }

    /**
     * Obtener categorías
     */
    async prompts(): Promise<FirestorePrompt[]> {
        return await this.firestoreService.getPrompts();
    }
    /**
     * Obtener categorías
     */
    async categories(): Promise<FirestoreCategory[]> {
        return await this.firestoreService.getCategories();
    }

    /**
     * Obtener categorías
     */
    async tags(): Promise<FirestoreTag[]> {
        return await this.firestoreService.getTags();
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
        const tag = await this.firestoreService.getTagBySlug(slug);
        if (!tag) {
            throw new Error(`No se encontró el tag '${slug}'.`);
        }
        const prompts = await this.firestoreService.getPromptsByTag(tag.name);
        return { name: this.titleCase(tag.name), prompts };
    }

    /**
     * Crear un nuevo prompt y actualizar tags/categoría
     */
    async createPrompt(prompt: AddPrompt): Promise<string | null> {
        const id = await this.firestoreService.createPrompt(prompt);
        return id;
    }

    /**
     * Actualizar o crear tags/categoría con prompt_count
     */
    async updateTagsAndCategory(tags: string[], categoria: string, erase: boolean): Promise<void> {
        // Buscar y actualizar categoría
        const cats = await this.categories();
        const cat = cats.find((c) => c.name.toLowerCase() === categoria);
        if (cat) {
            const newCount = (cat.prompt_count ?? 0) + (erase ? -1 : 1);
            if (newCount <= 0) {
                console.log(`Eliminando categoría '${cat.name}' porque su prompt_count es 0`);
                await this.firestoreService.deleteCategory(cat.id!);
            } else {
                await this.firestoreService.updateCategoryPromptCount(cat.id!, newCount);
            }
        } else {
            await this.firestoreService.createCategory({
                name: categoria,
                prompt_count: 1,
                slug: "",
            });
        }
        // Buscar y actualizar tags
        const allTags = await this.tags();
        for (const tag of tags) {
            const t = allTags.find((x) => x.name.toLowerCase() === tag);
            if (t) {
                const newCount = (t.prompt_count ?? 0) + (erase ? -1 : 1);
                if (newCount <= 0) {
                    await this.firestoreService.deleteTag(t.id!);
                } else {
                    await this.firestoreService.updateTagPromptCount(t.id!, newCount);
                }
            } else {
                await this.firestoreService.createTag({
                    name: tag,
                    prompt_count: 1,
                    slug: "",
                });
            }
        }
    }

    /** Eliminar prompt */
    async deletePrompt(id: string): Promise<void> {
        // Primero obtener el prompt para saber sus tags y categoría
        const prompt = await this.firestoreService.getPromptById(id);
        if (!prompt) {
            throw new Error(`No se encontró el prompt con ID '${id}'.`);
        }

        console.log(
            `Eliminando prompt con ID '${id}' y actualizando tags/categoría...`,
            prompt.tags,
            prompt.categoria
        );
        const tags = [...prompt.tags];
        const category = prompt.categoria;

        // Eliminar el prompt
        await this.firestoreService.deletePrompt(id);

        // Actualizar tags y categoría
        await this.updateTagsAndCategory(tags, category, true);
    }

    async deleteTag(name: string) {
        const tag = (await this.tags()).find((t) => t.name.toLowerCase() === name.toLowerCase());
        if (!tag) {
            throw new Error(`No se encontró el tag '${name}'.`);
        }
        // Eliminar el tag
        await this.firestoreService.deleteTag(tag.id!);
    }

    async deleteCategory(name: string) {
        const category = (await this.categories()).find(
            (c) => c.name.toLowerCase() === name.toLowerCase()
        );
        if (!category) {
            throw new Error(`No se encontró la categoría '${name}'.`);
        }
        // Eliminar la categoría
        await this.firestoreService.deleteCategory(category.id!);
    }

    /**
     * Obtener prompt por slug/ID
     */
    async bySlug(slug: string): Promise<FirestorePrompt> {
        const prompt = await this.firestoreService.getPromptBySlug(slug);
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
