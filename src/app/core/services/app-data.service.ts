import { Injectable, inject } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { FirestorePrompt, AddPrompt } from "../models";
import { map, of, tap } from "rxjs";

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
        return this.firestoreService.getPrompts();
    }

    /**
     * Obtener categorías
     */
    categories() {
        return this.firestoreService.getCategories();
    }

    /**
     * Obtener categorías
     */
    tags() {
        return this.firestoreService.getTags();
    }

    /**
     * Obtener prompts por categoría
     */
    byCategorySlug(slug: string) {
        return this.firestoreService.getCategoryBySlug(slug).pipe(
            map((category) => {
                if (!category) {
                    throw new Error(`No se encontró la categoría '${slug}'.`);
                }

                return this.byCategoryName(category.name);
            })
        );
    }

    byCategoryName(name: string) {
        return this.firestoreService.getPromptsByCategory(name).pipe(
            map((prompts) => {
                return { name: this.titleCase(name), prompts };
            })
        );
    }

    byTagSlug(slug: string) {
        return this.firestoreService.getTagBySlug(slug).pipe(
            map((tag) => {
                if (!tag) {
                    throw new Error(`No se encontró el tag '${slug}'.`);
                }
                return this.byTagName(tag.name);
            })
        );
    }

    byTagName(name: string) {
        return this.firestoreService.getPromptsByTag(name).pipe(
            map((prompts) => {
                return { name: this.titleCase(name), prompts };
            })
        );
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
        this.categories().subscribe((cats) => {
            const cat = cats.find((c) => c.name.toLowerCase() === categoria);
            if (cat) {
                const newCount = (cat.prompt_count ?? 0) + (erase ? -1 : 1);
                if (newCount <= 0) {
                    this.firestoreService.deleteCategory(cat.id!);
                } else {
                    this.firestoreService.updateCategoryPromptCount(cat.id!, newCount);
                }
            } else {
                this.firestoreService.createCategory({
                    name: categoria,
                    prompt_count: 1,
                    slug: "",
                });
            }
        });

        // Buscar y actualizar tags
        this.tags().subscribe((allTags) => {
            for (const tag of tags) {
                const t = allTags.find((x) => x.name.toLowerCase() === tag);
                if (t) {
                    const newCount = (t.prompt_count ?? 0) + (erase ? -1 : 1);
                    if (newCount <= 0) {
                        this.firestoreService.deleteCategory(t.id!);
                    } else {
                        this.firestoreService.updateTagPromptCount(t.id!, newCount);
                    }
                } else {
                    this.firestoreService.createTag({
                        name: tag,
                        prompt_count: 1,
                        slug: "",
                    });
                }
            }
        });
    }

    /** Eliminar prompt */
    deletePrompt(id: string) {
        this.firestoreService.getPromptById(id)?.subscribe((prompt) => {
            if (!prompt) {
                return;
            }

            const tags = [...prompt.tags];
            const category = prompt.categoria;

            this.firestoreService.deletePrompt(id).then(() => {
                this.updateTagsAndCategory(tags, category, true);
            });
        });
    }

    deleteTag(name: string) {
        return this.tags().pipe(
            map((tags) => tags.find((t) => t.name.toLowerCase() === name.toLowerCase())),
            tap((tag) => {
                if (!tag) {
                    throw new Error(`No se encontró el tag '${name}'.`);
                }
                // Eliminar el tag
                this.firestoreService.deleteCategory(tag.id!);
            })
        );
    }

    deleteCategory(name: string) {
        return this.categories().pipe(
            map((cats) => cats.find((c) => c.name.toLowerCase() === name.toLowerCase())),
            tap((cat) => {
                if (!cat) {
                    throw new Error(`No se encontró la categoría '${name}'.`);
                }
                // Eliminar el tag
                this.firestoreService.deleteCategory(cat.id!);
            })
        );
    }

    /**
     * Obtener prompt por slug
     */
    bySlug(slug: string) {
        return this.firestoreService.getPromptBySlug(slug);
    }

    /**
     * Obtener prompt por ID
     */
    byId(id: string) {
        return this.firestoreService.getPromptById(id);
    }

    // Métodos privados

    private searchInFirestore(searchTerm: string) {
        try {
            return this.firestoreService.searchPrompts(searchTerm).pipe(
                map((prompts) => {
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
                })
            );
        } catch (error) {
            console.error("Error en búsqueda de Firestore:", error);
            return of({
                search: searchTerm,
                found: [] as {
                    item: FirestorePrompt;
                    foundIn: foundInKey;
                    position: number;
                    relevanceScore: number;
                }[],
            });
        }
    }

    private titleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

export type ResultadoBusqueda = {
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
