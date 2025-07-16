import { Injectable, signal } from "@angular/core";
import promptsNormalizados from "../../../data/normalizados";
import { Prompt } from "../../features/prompts/prompt";
import { NavigationItem } from "../../features/navigation/navigation-item";

@Injectable({
    providedIn: "root",
})
export class PersistService {
    private promptsList = promptsNormalizados;
    public prompts = signal(this.promptsList);
    public categories = signal<NavigationItem[]>([]);
    public tags = signal<NavigationItem[]>([]);

    constructor() {
        this.initializeCategories();
        this.initializeTags();
    }

    private initializeCategories() {
        const categoriesSet = new Set<string>();
        this.prompts().forEach((prompt) => {
            categoriesSet.add(prompt.categoria);
        });
        this.categories.set(
            Array.from(categoriesSet)
                .map((categoria) => {
                    const promptsForCategory = this.prompts().filter(
                        (prompt) => prompt.categoria.localeCompare(categoria) === 0
                    );
                    return {
                        text: categoria,
                        slug: this.slugify(categoria),
                        cantidad: promptsForCategory.length,
                        prompts: promptsForCategory,
                    };
                })
                .sort((a, b) => b.cantidad - a.cantidad || a.text.localeCompare(b.text))
        );
    }

    private initializeTags() {
        const tagsSet = new Set<string>();
        this.prompts().forEach((prompt) => {
            prompt.tags.forEach((tag) => {
                tagsSet.add(tag);
            });
        });

        this.tags.set(
            Array.from(tagsSet)
                .map((tag) => {
                    const promptsForTag = this.prompts().filter((prompt) => prompt.tags.includes(tag));
                    return {
                        text: tag,
                        slug: this.slugify(tag),
                        cantidad: promptsForTag.length,
                        prompts: promptsForTag,
                    };
                })
                .sort((a, b) => b.cantidad - a.cantidad || a.text.localeCompare(b.text))
        );
    }

    byCategory(slug: string): { name: string; prompts: Prompt[] } | null {
        const category = this.categories().find((cat) => cat.slug === slug);

        if (!category) {
            return null;
        }

        return { name: category.text, prompts: category.prompts || [] };
    }

    byTag(slug: string): { name: string; prompts: Prompt[] } | null {
        const tag = this.tags().find((tag) => tag.slug === slug);

        if (!tag) {
            return null;
        }

        return { name: tag.text, prompts: tag.prompts || [] };
    }

    byId(id: number) {
        return this.prompts().find((prompt) => prompt.id === id) || null;
    }

    search(searchTerm: string): ResultadoBusqueda {
        searchTerm = searchTerm.trim().toLowerCase();
        const categorias = this.categories().filter((cat) => cat.text.toLowerCase().includes(searchTerm));
        const etiquetas = this.tags().filter((tag) => tag.text.toLowerCase().includes(searchTerm));

        const allPrompts = this.prompts();
        const prompts = [] as { item: Prompt; foundIn: foundInKey; position: number }[];
        let i = 0;
        for (i = 0; i < allPrompts.length; i++) {
            const item = allPrompts[i];
            if (prompts.length >= 10) break;
            let index = item.titulo.toLowerCase().indexOf(searchTerm);
            if (index >= 0) {
                prompts.push({ item, foundIn: "titulo", position: index });
                continue;
            }
            index = item.prompt.toLowerCase().indexOf(searchTerm);
            if (index >= 0) {
                prompts.push({ item, foundIn: "prompt", position: index });
                continue;
            }
            index = item.descripcion.toLowerCase().indexOf(searchTerm);
            if (index >= 0) {
                prompts.push({ item, foundIn: "descripcion", position: index });
                continue;
            }
            index = item.autor.toLowerCase().indexOf(searchTerm);
            if (index >= 0) {
                prompts.push({ item, foundIn: "autor", position: index });
                continue;
            }
            if (item.categoria.toLowerCase() === searchTerm) {
                prompts.push({ item, foundIn: "categoria", position: 0 });
                continue;
            }
            if (item.tags.some((tag) => tag.toLowerCase() === searchTerm)) {
                prompts.push({ item, foundIn: "tags", position: 0 });
                continue;
            }
        }

        if (prompts.length === 0 && etiquetas.length === 0) {
            return { search: searchTerm, categorias: [], etiquetas: [], found: [] };
        } else {
        }

        return {
            search: searchTerm,
            categorias: categorias.map((cat) => cat.text),
            etiquetas: etiquetas.map((tag) => tag.text),
            found: prompts.sort((a, b) => a.position - b.position),
        };
    }

    private slugify(name: string): string {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
    }
}

export type ResultadoBusqueda = {
    search: string;
    categorias: string[];
    etiquetas: string[];
    found: { item: Prompt; foundIn: foundInKey; position: number }[];
};

export type foundInKey = "titulo" | "prompt" | "descripcion" | "autor" | "categoria" | "tags";
