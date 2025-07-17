import { Injectable, signal } from "@angular/core";
import promptsNormalizados from "../../../data/normalizados";
import { Prompt } from "../../features/prompts/prompt";
import { NavigationItem } from "../../features/navigation/navigation-item";
import { normalizeSearchText, createSearchMatcher, createTextHighlight } from "../utils/search.utils";

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
                        text: this.titleCase(categoria),
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
                        text: this.titleCase(tag),
                        slug: this.slugify(tag),
                        cantidad: promptsForTag.length,
                        prompts: promptsForTag,
                    };
                })
                .sort((a, b) => b.cantidad - a.cantidad || a.text.localeCompare(b.text))
        );
    }

    byCategory(slug: string): { name: string; prompts: Prompt[] } {
        const category = this.categories().find((cat) => cat.slug === slug);

        if (!category) {
            throw new Error(`No se encontró la categoría '${slug}'.`);
        }

        return { name: category.text, prompts: category.prompts || [] };
    }

    byTag(slug: string): { name: string; prompts: Prompt[] } {
        const tag = this.tags().find((tag) => tag.slug === slug);

        if (!tag) {
            throw new Error(`No se encontró la etiqueta '${slug}'.`);
        }

        return { name: tag.text, prompts: tag.prompts || [] };
    }

    byId(id: number) {
        const prompt = this.prompts().find((prompt) => prompt.id === id);
        if (!prompt) {
            throw new Error(`No se encontró un prompt con  id '${id}'.`);
        }

        return prompt;
    }

    search(searchTerm: string): ResultadoBusqueda {
        const trimmedSearch = searchTerm.trim();
        if (!trimmedSearch) {
            return { search: "", categorias: [], etiquetas: [], found: [] };
        }

        // Dividir en términos individuales para búsqueda más flexible
        const searchTerms = trimmedSearch.split(/\s+/).filter((term) => term.length > 0);
        const matcher = createSearchMatcher(searchTerms);

        // Buscar en categorías y etiquetas con normalización
        const categorias = this.categories().filter((cat) => matcher.matches(cat.text));
        const etiquetas = this.tags().filter((tag) => matcher.matches(tag.text));

        // Buscar en prompts con priorización por relevancia
        const found = this.searchInPrompts(searchTerms, matcher, 10);

        return {
            search: trimmedSearch,
            categorias: categorias.map((cat) => cat.text),
            etiquetas: etiquetas.map((tag) => tag.text),
            found: found,
        };
    }

    private searchInPrompts(
        searchTerms: string[],
        matcher: ReturnType<typeof createSearchMatcher>,
        maxResults: number = 10
    ): { item: Prompt; foundIn: foundInKey; position: number; relevanceScore: number }[] {
        const results: { item: Prompt; foundIn: foundInKey; position: number; relevanceScore: number }[] = [];

        // Definir campos de búsqueda con pesos para relevancia
        const searchFields: { field: foundInKey; weight: number }[] = [
            { field: "titulo", weight: 10 }, // Mayor peso para título
            { field: "prompt", weight: 8 }, // Alto peso para prompt
            { field: "descripcion", weight: 5 }, // Peso medio para descripción
            { field: "autor", weight: 3 }, // Menor peso para autor
            { field: "categoria", weight: 6 }, // Peso alto para categoría
            { field: "tags", weight: 7 }, // Alto peso para tags
        ];

        for (const prompt of this.prompts()) {
            if (results.length >= maxResults) break;

            let bestMatch: { field: foundInKey; position: number; score: number } | null = null;

            // Buscar en cada campo
            for (const { field, weight } of searchFields) {
                if (field === "tags") {
                    // Búsqueda especial en tags
                    const hasMatchingTag = prompt.tags.some((tag) => matcher.matches(tag));
                    if (hasMatchingTag) {
                        const score = weight * 2; // Bonus por coincidencia exacta en tag
                        if (!bestMatch || score > bestMatch.score) {
                            bestMatch = { field, position: 0, score };
                        }
                    }
                } else if (field === "categoria") {
                    // Búsqueda especial en categoría
                    if (matcher.matches(prompt.categoria)) {
                        const score = weight * 1.5; // Bonus por coincidencia en categoría
                        if (!bestMatch || score > bestMatch.score) {
                            bestMatch = { field, position: 0, score };
                        }
                    }
                } else {
                    // Búsqueda en campos de texto
                    const fieldText = prompt[field] as string;
                    const match = matcher.findBestMatch(fieldText);
                    if (match.found) {
                        // Calcular score basado en posición y peso
                        const positionBonus = Math.max(0, 100 - match.position); // Bonus por posición temprana
                        const score = weight + positionBonus * 0.1;

                        if (!bestMatch || score > bestMatch.score) {
                            bestMatch = { field, position: match.position, score };
                        }
                    }
                }
            }

            // Si encontramos una coincidencia, agregarla a los resultados
            if (bestMatch) {
                results.push({
                    item: prompt,
                    foundIn: bestMatch.field,
                    position: bestMatch.position,
                    relevanceScore: bestMatch.score,
                });
            }
        }

        // Ordenar por relevancia (score) y luego por posición
        return results.sort((a, b) => {
            const scoreDiff = b.relevanceScore - a.relevanceScore;
            return scoreDiff !== 0 ? scoreDiff : a.position - b.position;
        });
    }

    private slugify(name: string): string {
        return name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
    }

    private titleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

export type ResultadoBusqueda = {
    search: string;
    categorias: string[];
    etiquetas: string[];
    found: { item: Prompt; foundIn: foundInKey; position: number; relevanceScore: number }[];
};

export type foundInKey = "titulo" | "prompt" | "descripcion" | "autor" | "categoria" | "tags";
