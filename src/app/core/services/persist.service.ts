import { computed, inject, Injectable, resource } from "@angular/core";
import { Prompt } from "../../features/prompts/prompt";
import { NavigationItem } from "../../features/navigation/navigation-item";
import { createSearchMatcher, normalizeSearchText } from "../utils/search-utils";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, map, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DataService {
    promptsResource = resource({
        loader: async () => {
            return fetch("data.json")
                .then((res) => res.json() as Promise<Prompt[]>)
                .catch((error) => {
                    console.error("Error loading prompts:", error);
                    return [] as Prompt[];
                });
        },
    });

    public prompts = computed<Prompt[]>(() => this.promptsResource.value() || []);

    ready$: Observable<DataService> = toObservable(this.prompts).pipe(
        filter((prompts) => prompts.length > 0),
        map(() => this)
    );

    public categories = computed<NavigationItem[]>(() => this.initializeCategories(this.prompts()));

    public tags = computed<NavigationItem[]>(() => this.initializeTags(this.prompts()));

    private initializeCategories(prompts: Prompt[]) {
        const categoriesSet = new Set<string>();
        prompts.forEach((prompt) => {
            categoriesSet.add(prompt.categoria);
        });
        return Array.from(categoriesSet)
            .map((categoria) => {
                const promptsForCategory = prompts.filter(
                    (prompt) => prompt.categoria.localeCompare(categoria) === 0
                );
                return {
                    text: this.titleCase(categoria),
                    slug: this.slugify(categoria),
                    cantidad: promptsForCategory.length,
                    prompts: promptsForCategory,
                };
            })
            .sort((a, b) => b.cantidad - a.cantidad || a.text.localeCompare(b.text));
    }

    private initializeTags(prompts: Prompt[]) {
        const tagsSet = new Set<string>();
        prompts.forEach((prompt) => {
            prompt.tags.forEach((tag) => {
                tagsSet.add(tag);
            });
        });

        return Array.from(tagsSet)
            .map((tag) => {
                const promptsForTag = prompts.filter((prompt) => prompt.tags.includes(tag));
                return {
                    text: this.titleCase(tag),
                    slug: this.slugify(tag),
                    cantidad: promptsForTag.length,
                    prompts: promptsForTag,
                };
            })
            .sort((a, b) => b.cantidad - a.cantidad || a.text.localeCompare(b.text));
    }

    byCategory(slug: string): ListPrompts {
        const category = this.categories().find((cat) => cat.slug === slug);

        if (!category) {
            throw new Error(`No se encontró la categoría '${slug}'.`);
        }

        return { name: category.text, prompts: category.prompts || [] };
    }

    byTag(slug: string): ListPrompts {
        const tag = this.tags().find((tag) => tag.slug === slug);

        if (!tag) {
            throw new Error(`No se encontró la etiqueta '${slug}'.`);
        }

        return { name: tag.text, prompts: tag.prompts || [] };
    }

    byId(slug: string): Prompt {
        const prompt = this.prompts().find((prompt) => prompt.slug === slug);
        if (!prompt) {
            throw new Error(`No se encontró un prompt '${slug}'.`);
        }

        return prompt;
    }

    search(searchTerm: string, enableFuzzy: boolean = true): ResultadoBusqueda {
        const trimmedSearch = searchTerm.trim();
        if (!trimmedSearch) {
            return { search: "", found: [] };
        }

        // Dividir en términos individuales para búsqueda más flexible
        const searchTerms = trimmedSearch.split(/\s+/).filter((term) => term.length > 0);
        const matcher = createSearchMatcher(searchTerms, enableFuzzy);

        // Buscar en prompts con priorización por relevancia
        const found = this.searchInPrompts(searchTerms, matcher, 10);

        return {
            search: trimmedSearch,
            found: found,
        };
    }

    private searchInPrompts(
        searchTerms: string[],
        matcher: ReturnType<typeof createSearchMatcher>,
        maxResults: number = 10
    ): { item: Prompt; foundIn: foundInKey; position: number; relevanceScore: number }[] {
        const results: {
            item: Prompt;
            foundIn: foundInKey;
            position: number;
            relevanceScore: number;
        }[] = [];

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
        return normalizeSearchText(name)
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
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
