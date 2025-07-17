import { Component, computed, inject, signal } from "@angular/core";
import { SearchHeader } from "../../core/components/header/search-header";
import { PersistService } from "../../core/services/persist.service";
import { NgClass } from "@angular/common";
import { ChipsList } from "../../core/components/chips-list/chips-list";

@Component({
    selector: "pd-searching",
    imports: [SearchHeader, NgClass, ChipsList],
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
                        <div class=" whitespace-nowrap flex flex-row justify-start items-center">
                            @for (part of prompt.titulo.parts; track $index; let i = $index) {
                            <span
                                class="text-lg  whitespace-pre"
                                [ngClass]="{ 'dark:bg-[#FFFF0060] bg-[#FFFF00]': i === prompt.titulo.in }"
                                >{{ part }}</span
                            >
                            }
                        </div>
                        <div class=" whitespace-nowrap flex flex-row justify-start items-center">
                            @for (part of prompt.prompt.parts; track $index; let i = $index) {
                            <span
                                class="text-lg whitespace-pre"
                                [ngClass]="{ 'dark:bg-[#FFFF0060] bg-[#FFFF00]': i === prompt.prompt.in }"
                                >{{ part }}</span
                            >
                            }
                        </div>
                        <div class=" whitespace-nowrap flex flex-row justify-start items-center">
                            @for (part of prompt.descripcion.parts; track $index; let i = $index) {
                            <span
                                class="text-lg whitespace-pre"
                                [ngClass]="{ 'dark:bg-[#FFFF0060] bg-[#FFFF00]': i === prompt.descripcion.in }"
                                >{{ part }}</span
                            >
                            }
                        </div>
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
            const item = {
                id: found.item.id,
                titulo: { parts: [] as string[], in: -1 },
                prompt: { parts: [] as string[], in: -1 },
                descripcion: { parts: [] as string[], in: -1 },
                autor: { parts: [] as string[], in: -1 },
                categoria: { parts: [] as string[], in: -1 },
                tags: [] as string[],
            };

            if (searchTerm.length > 0) {
                if (found.foundIn !== "tags") {
                    item[found.foundIn] = this.relevantSection(
                        found.item[found.foundIn],
                        found.position,
                        searchTerm.length
                    );
                } else {
                    item.tags = found.item.tags.filter((tag) => resultado.etiquetas.includes(tag.toLowerCase()));
                }
            }
            if (item.titulo.parts.length === 0) {
                item.titulo = { parts: [`${found.item.titulo.slice(0, this.longitud)}`], in: -1 };
            }
            if (item.prompt.parts.length === 0) {
                item.prompt = { parts: [`${found.item.prompt.slice(0, this.longitud)}`], in: -1 };
            }
            if (item.descripcion.parts.length === 0) {
                item.descripcion = { parts: [`${found.item.descripcion.slice(0, this.longitud)}...`], in: -1 };
            }
            return item;
        });

        this.etiquetas.set(resultado.etiquetas);
        this.categorias.set(resultado.categorias);
        this.prompts.set(salida);
    }

    private relevantSection(text: string, position: number, searchLength: number): { parts: string[]; in: number } {
        const start = position - this.mediaLongitud;
        const end = position + searchLength + this.mediaLongitud;
        const foundText = text.slice(position, position + searchLength);

        if (position <= 0) {
            return { parts: [foundText, text.slice(position + searchLength, this.longitud)], in: 0 };
        }
        if (position + searchLength >= text.length) {
            return { parts: [text.slice(-this.longitud, -searchLength), foundText], in: 1 };
        }

        if (start < 0) {
            return {
                parts: [text.slice(0, position), foundText, text.slice(position + searchLength, this.longitud)],
                in: 1,
            };
        }
        if (end > text.length) {
            return {
                parts: [
                    text.slice(Math.max(0, text.length - this.longitud), position),
                    foundText,
                    text.slice(position + searchLength),
                ],
                in: 1,
            };
        }

        return {
            parts: [text.slice(start, position), foundText, text.slice(position + searchLength, end)],
            in: 1,
        };
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
