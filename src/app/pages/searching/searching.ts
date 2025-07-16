import { Component, inject, signal } from "@angular/core";
import { SearchHeader } from "../../core/components/header/search-header";
import { PersistService } from "../../core/services/persist.service";
import { LabelItem } from "../../core/components/key-value-item/label-item";
import { NgClass } from "@angular/common";

@Component({
    selector: "pd-searching",
    imports: [SearchHeader, LabelItem, NgClass],
    template: `<header pd-search-header (search)="onSearch($event)"></header>
        <div class="px-6 py-4">
            @if(etiquetas().length > 0) {
            <h4 class="py-2 font-medium">Etiquetas</h4>
            <ul class="flex flex-row gap-3 overflow-x-auto pt-1 pb-6">
                @for (tag of etiquetas(); track tag) {
                <li class="text-sm  px-3 py-1  whitespace-nowrap rounded-lg border-primary-dark border-[1px] ">
                    {{ tag }}
                </li>
                }
            </ul>
            } @if(categorias().length > 0) {
            <h4 class="py-2 font-medium">Categorías</h4>
            <ul class="flex flex-row gap-3 overflow-x-auto pt-1 pb-6">
                @for (tag of categorias(); track tag) {
                <li class="text-sm  px-3 py-1  whitespace-nowrap rounded-lg border-primary-dark border-[1px] ">
                    {{ tag }}
                </li>
                }
            </ul>
            }
            <div class=" py-6 w-full">
                <ul class="divide-y-[0.5px] divide-gray-500 space-y-2">
                    @for ( prompt of prompts(); track prompt.id) {
                    <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                        <div class=" whitespace-nowrap flex flex-row justify-start items-center">
                            @for (part of prompt.titulo.parts; track part; let i = $index) {
                            <span
                                class="text-lg  whitespace-pre"
                                [ngClass]="{ 'dark:bg-[#FFFF0060] bg-[#FFFF00]': i === prompt.titulo.in }"
                                >{{ part }}</span
                            >
                            }
                        </div>
                        <div class=" whitespace-nowrap flex flex-row justify-start items-center">
                            @for (part of prompt.prompt.parts; track part; let i = $index) {
                            <span
                                class="text-lg whitespace-pre"
                                [ngClass]="{ 'dark:bg-[#FFFF0060] bg-[#FFFF00]': i === prompt.prompt.in }"
                                >{{ part }}</span
                            >
                            }
                        </div>
                        <div class=" whitespace-nowrap flex flex-row justify-start items-center">
                            @for (part of prompt.descripcion.parts; track part; let i = $index) {
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
    persistService = inject(PersistService);

    prompts = signal<ItemEncontrado[]>([]);

    etiquetas = signal<string[]>([]);
    categorias = signal<string[]>([]);
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
