import { Component, computed, inject, signal } from "@angular/core";
import { SearchHeader } from "../../core/components/header/search-header";
import { PersistService } from "../../core/services/persist.service";
import { ChipsList } from "../../core/components/chips-list/chips-list";
import { HighlightedTextComponent } from "../../core/components/highlighted-text/highlighted-text";
import { createTextHighlight } from "../../core/utils/search.utils";

@Component({
    selector: "pd-searching",
    imports: [SearchHeader, ChipsList, HighlightedTextComponent],
    template: `<header pd-search-header (search)="onSearch($event)"></header>
        <div class="px-6 py-4 overflow-hidden">
            <h4 class="py-2">Categorías</h4>
            <pd-chips-list [items]="categoriasActuales()"></pd-chips-list>
            <h4 class="py-2">Etiquetas</h4>
            <pd-chips-list [items]="etiquetasActuales()"></pd-chips-list>

            <div class="py-6 w-full">
                <ul class="divide-y-[0.5px] divide-gray-500 space-y-2">
                    @for ( prompt of prompts(); track prompt.id) {
                    <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
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
    private etiquetas = signal<string[]>([]);
    private categorias = signal<string[]>([]);

    prompts = signal<ItemEncontrado[]>([]);
    etiquetasActuales = computed(() =>
        this.todasLasEtiquetas
            .map((tag) => ({
                id: tag.slug,
                name: tag.text,
                activa:
                    this.etiquetas().length !== this.todasLasEtiquetas.length && this.etiquetas().includes(tag.text),
            }))
            .sort((a, b) => (a.activa === true ? 0 : 1) - (b.activa === true ? 0 : 1) || a.name.localeCompare(b.name))
    );

    categoriasActuales = computed(() =>
        this.todasLasCategorias
            .map((cat) => ({
                id: cat.slug,
                name: cat.text,
                activa:
                    this.categorias().length !== this.todasLasCategorias.length && this.categorias().includes(cat.text),
            }))
            .sort((a, b) => (a.activa === true ? 0 : 1) - (b.activa === true ? 0 : 1) || a.name.localeCompare(b.name))
    );

    onSearch(searchTerm: string) {
        const resultado = this.persistService.search(searchTerm!);
        if (resultado.found.length === 0) {
            this.etiquetas.set([]);
            this.categorias.set([]);
            this.prompts.set([]);
            return;
        }

        const salida = resultado.found.map((found) => {
            const item: ItemEncontrado = {
                id: found.item.id,
                titulo: { parts: [], in: -1 },
                prompt: { parts: [], in: -1 },
                descripcion: { parts: [], in: -1 },
                autor: { parts: [], in: -1 },
                categoria: { parts: [], in: -1 },
                tags: [],
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
                        resultado.etiquetas.some((etiqueta) => etiqueta.toLowerCase() === tag.toLowerCase())
                    );
                }
            }

            // Rellenar campos vacíos con valores por defecto
            this.fillEmptyFields(item, found.item);
            return item;
        });

        this.etiquetas.set(resultado.etiquetas);
        this.categorias.set(resultado.categorias);
        this.prompts.set(salida);
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
