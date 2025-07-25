import { Injectable, inject } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { Prompt, AddPrompt } from "../models";

@Injectable({
    providedIn: "root",
})
export class AppDataService {
    private readonly firestoreService = inject(FirestoreService);

    public search(searchTerm: string) {
        return this.searchInFirestore(searchTerm);
    }

    public prompts() {
        return this.firestoreService.prompts();
    }

    public categories() {
        return this.firestoreService.categories();
    }

    public tags() {
        return this.firestoreService.tags();
    }

    public async categoryNameBySlug(slug: string): Promise<string> {
        return this.firestoreService.categoryNameBySlug(slug);
    }

    public async tagNameBySlug(slug: string): Promise<string> {
        return this.firestoreService.tagNameBySlug(slug);
    }

    public async byCategoryName(name: string) {
        return {
            name: this.titleCase(name),
            prompts: await this.firestoreService.getPromptsByCategory(name),
        };
    }

    public async byTagName(name: string) {
        return {
            name: this.titleCase(name),
            prompts: await this.firestoreService.getPromptsByTag(name),
        };
    }

    public async createPrompt(prompt: AddPrompt) {
        await this.firestoreService.createPrompt(prompt).then((id) => {
            this.addOrUpdateCategory(prompt.categoria);
            this.addOrUpdateTags(prompt.tags);
        });
    }

    private async addOrUpdateCategory(categoria: string) {
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

    private addOrUpdateTags(tags: string[]) {
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

    private async updateOrDeleteCategory(categoria: string) {
        const count = this.prompts().filter((p) => p.categoria === categoria.toLowerCase()).length;
        console.log("Count for category:", categoria.toLowerCase(), count);
        if (count > 0) {
            await this.firestoreService.updateTagPromptCount(categoria.toLowerCase(), count + 1);
        } else {
            await this.firestoreService.deleteCategory(categoria.toLowerCase());
        }
    }

    private async updateOrDeleteTags(tags: string[]) {
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

    public async deletePrompt(id: string) {
        const prompt = this.firestoreService.getPromptById(id)!;

        const tags = [...prompt.tags];
        const category = prompt.categoria;

        await this.firestoreService.deletePrompt(id).then(() => {
            this.updateOrDeleteCategory(category);
            this.updateOrDeleteTags(tags);
        });
    }

    public async deleteTag(name: string) {
        await this.firestoreService.deleteTag(name.toLowerCase());
    }

    public async deleteCategory(name: string) {
        await this.firestoreService.deleteCategory(name.toLowerCase());
    }

    public async bySlug(slug: string) {
        return this.firestoreService.getPromptBySlug(slug);
    }

    private searchInFirestore(searchTerm: string) {
        try {
            const found = this.firestoreService.searchPrompts(searchTerm).map((prompt) => {
                return {
                    item: prompt,
                    foundIn: "titulo" as const,
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

type foundInKey = "titulo" | "prompt" | "descripcion" | "autor" | "categoria" | "tags";

export type ListPrompts = { name: string; prompts: Prompt[] };
