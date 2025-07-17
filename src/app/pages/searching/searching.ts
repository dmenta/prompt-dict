import { Component, computed, inject, signal } from "@angular/core";
import { SearchHeader } from "../../core/components/header/search-header";
import { PersistService } from "../../core/services/persist.service";
import { ChipsList } from "../../core/components/chips-list/chips-list";
import { HighlightedTextComponent } from "../../core/components/highlighted-text/highlighted-text";
import { createTextHighlight } from "../../core/utils/search-improved.utils";
import { DecimalPipe } from "@angular/common";

@Component({
    selector: "pd-searching",
    imports: [SearchHeader, ChipsList, HighlightedTextComponent, DecimalPipe],
    template: `<header pd-search-header (search)="onSearch($event)"></header>
        <div class="px-6 py-4 overflow-hidden">
            <!-- Toggle para fuzzy search -->
            <div class="mb-4 flex items-center gap-3">
                <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <input
                        type="checkbox"
                        [checked]="fuzzySearchEnabled()"
                        (change)="onFuzzyToggle($event)"
                        class="rounded border-gray-300" />
                    Búsqueda inteligente (tolerante a errores)
                </label>
            </div>

            <h4 class="py-2">Categorías</h4>
            <pd-chips-list [items]="categoriasActuales()" (chipClicked)="onCategoriaToggle($event)">
            </pd-chips-list>
            <h4 class="py-2">Etiquetas</h4>
            <pd-chips-list [items]="etiquetasActuales()" (chipClicked)="onEtiquetaToggle($event)">
            </pd-chips-list>

            <div class="py-6 w-full">
                <ul class="divide-y-[0.5px] divide-gray-500 space-y-2">
                    @for ( prompt of prompts(); track prompt.id) {
                    <li class="flex flex-col pt-1 pb-3 items-start justify-center relative">
                        <!-- Indicador de tipo de match -->
                        <div class="absolute top-1 right-1 flex gap-1">
                            @if (prompt.matchType === 'fuzzy') {
                            <span
                                class="text-xs px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full font-medium">
                                ~{{ prompt.matchScore * 100 | number : "1.0-0" }}%
                            </span>
                            } @else {
                            <span
                                class="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium">
                                Exacto
                            </span>
                            }
                        </div>

                        <pd-highlighted-text [textData]="prompt.titulo"></pd-highlighted-text>
                        <pd-highlighted-text [textData]="prompt.prompt"></pd-highlighted-text>
                        <pd-highlighted-text [textData]="prompt.descripcion"></pd-highlighted-text>
                    </li>
                    }
                </ul>
            </div>
        </div>`,
})
export class Searching {
    private longitud = 40;
    private mediaLongitud = this.longitud / 2;
    private persistService = inject(PersistService);
    private todasLasEtiquetas = this.persistService.tags();
    private todasLasCategorias = this.persistService.categories();

    // Estados de filtros y configuración
    private etiquetas = signal<string[]>([]);
    private categorias = signal<string[]>([]);
    private currentSearchTerm = signal<string>("");
    public fuzzySearchEnabled = signal<boolean>(true);

    // Estado de resultados - estos incluyen información sobre el tipo de match
    private allSearchResults = signal<ItemEncontradoExtendido[]>([]);

    // Prompts filtrados por categorías y etiquetas seleccionadas
    prompts = computed(() => {
        const results = this.allSearchResults();
        const selectedCategories = this.categorias();
        const selectedTags = this.etiquetas();

        if (selectedCategories.length === 0 && selectedTags.length === 0) {
            return results;
        }

        return results.filter((prompt) => {
            // Para categorías: verificar en el item original
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.some((selectedCat) => {
                    const originalCategory = prompt.originalItem.categoria;
                    return originalCategory.toLowerCase().includes(selectedCat.toLowerCase());
                });

            // Para tags: verificar en el item original
            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((selectedTag) => {
                    const originalTags = prompt.originalItem.tags || [];
                    return originalTags.some((tag: string) =>
                        tag.toLowerCase().includes(selectedTag.toLowerCase())
                    );
                });

            return matchesCategory && matchesTags;
        });
    });
    etiquetasActuales = computed(() =>
        this.todasLasEtiquetas
            .map((tag) => ({
                id: tag.slug,
                name: tag.text,
                activa:
                    this.etiquetas().length !== this.todasLasEtiquetas.length &&
                    this.etiquetas().includes(tag.text),
            }))
            .sort(
                (a, b) =>
                    (a.activa === true ? 0 : 1) - (b.activa === true ? 0 : 1) ||
                    a.name.localeCompare(b.name)
            )
    );

    categoriasActuales = computed(() =>
        this.todasLasCategorias
            .map((cat) => ({
                id: cat.slug,
                name: cat.text,
                activa:
                    this.categorias().length !== this.todasLasCategorias.length &&
                    this.categorias().includes(cat.text),
            }))
            .sort(
                (a, b) =>
                    (a.activa === true ? 0 : 1) - (b.activa === true ? 0 : 1) ||
                    a.name.localeCompare(b.name)
            )
    );

    onSearch(searchTerm: string) {
        this.currentSearchTerm.set(searchTerm);
        const resultado = this.persistService.search(searchTerm!, this.fuzzySearchEnabled());

        if (resultado.found.length === 0) {
            this.etiquetas.set([]);
            this.categorias.set([]);
            this.allSearchResults.set([]);
            return;
        }

        const salida = resultado.found.map((found) => {
            const item: ItemEncontradoExtendido = {
                id: found.item.id,
                titulo: { parts: [], in: -1 },
                prompt: { parts: [], in: -1 },
                descripcion: { parts: [], in: -1 },
                autor: { parts: [], in: -1 },
                categoria: { parts: [], in: -1 },
                tags: [],
                matchType: found.relevanceScore === 1.0 ? "exact" : "fuzzy",
                matchScore: found.relevanceScore,
                originalItem: found.item,
            };

            // Solo procesar highlight si hay término de búsqueda
            if (searchTerm.length > 0) {
                if (found.foundIn !== "tags") {
                    // Usar la nueva utilidad de highlight
                    const highlight = createTextHighlight(
                        found.item[found.foundIn] as string,
                        searchTerm,
                        this.longitud
                    );
                    item[found.foundIn] = {
                        parts: highlight.parts,
                        in: highlight.highlightIndex,
                    };
                } else {
                    // Para tags, filtrar las que coinciden
                    item.tags = found.item.tags.filter((tag) =>
                        resultado.etiquetas.some(
                            (etiqueta) => etiqueta.toLowerCase() === tag.toLowerCase()
                        )
                    );
                }
            }

            // Rellenar campos vacíos con valores por defecto
            this.fillEmptyFields(item, found.item);
            return item;
        });

        this.etiquetas.set(resultado.etiquetas);
        this.categorias.set(resultado.categorias);
        this.allSearchResults.set(salida);
    }

    onCategoriaToggle(categoria: { id: string; name: string; activa: boolean }) {
        const current = this.categorias();
        if (categoria.activa) {
            // Si está activa, la removemos
            this.categorias.set(current.filter((cat) => cat !== categoria.name));
        } else {
            // Si no está activa, la agregamos
            this.categorias.set([...current, categoria.name]);
        }
    }

    onEtiquetaToggle(etiqueta: { id: string; name: string; activa: boolean }) {
        const current = this.etiquetas();
        if (etiqueta.activa) {
            // Si está activa, la removemos
            this.etiquetas.set(current.filter((tag) => tag !== etiqueta.name));
        } else {
            // Si no está activa, la agregamos
            this.etiquetas.set([...current, etiqueta.name]);
        }
    }

    onFuzzyToggle(event: Event) {
        const target = event.target as HTMLInputElement;
        this.fuzzySearchEnabled.set(target.checked);

        // Re-ejecutar la búsqueda con la nueva configuración
        if (this.currentSearchTerm()) {
            this.onSearch(this.currentSearchTerm());
        }
    }

    private fillEmptyFields(item: ItemEncontrado, originalItem: any): void {
        if (item.titulo.parts.length === 0) {
            item.titulo = {
                parts: [originalItem.titulo.slice(0, this.longitud)],
                in: -1,
            };
        }
        if (item.prompt.parts.length === 0) {
            item.prompt = {
                parts: [originalItem.prompt.slice(0, this.longitud)],
                in: -1,
            };
        }
        if (item.descripcion.parts.length === 0) {
            item.descripcion = {
                parts: [`${originalItem.descripcion.slice(0, this.longitud)}...`],
                in: -1,
            };
        }
    }
}

type ItemEncontrado = {
    id: number;
    titulo: { parts: string[]; in: number };
    prompt: { parts: string[]; in: number };
    descripcion: { parts: string[]; in: number };
    autor: { parts: string[]; in: number };
    categoria: { parts: string[]; in: number };
    tags: string[] | null;
};

type ItemEncontradoExtendido = ItemEncontrado & {
    matchType: "exact" | "fuzzy";
    matchScore: number;
    originalItem: any; // Para mantener referencia al item original
};
