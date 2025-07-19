import { Component, inject, signal } from "@angular/core";
import {
    createTextHighlight,
    HighlightedTextComponent,
    DataService,
    SearchHeader,
} from "../../core";
import { ActivatedRoute, Params, Router, RouterLink } from "@angular/router";
import { filter, map } from "rxjs";

@Component({
    selector: "pd-searching",
    imports: [SearchHeader, HighlightedTextComponent, RouterLink],
    template: `<header pd-search-header [term]="initSearch()" (search)="onSearch($event)"></header>
        <ul class="divide-y-[0.5px] divide-gray-500/50 px-6 py-4">
            @for ( prompt of allSearchResults(); track prompt.id) {
            <li class="overflow-x-hidden  py-2 w-full group">
                <a
                    [routerLink]="['/', promptUrl, prompt.originalItem.slug]"
                    class="opacity-90 group-hover:opacity-100 transition-opacity">
                    <pd-highlighted-text
                        [textData]="prompt.titulo"
                        class="text-primary-dark uppercase font-semibold text-sm/5"></pd-highlighted-text>
                    <pd-highlighted-text
                        [textData]="prompt.prompt"
                        class="font-merri italic"></pd-highlighted-text>
                    <pd-highlighted-text
                        [textData]="prompt.descripcion"
                        class="text-sm/5"></pd-highlighted-text>
                </a>
            </li>
            }
        </ul> `,
})
export class Searching {
    private longitud = 50;
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    private persistService = inject(DataService);
    private emptySearch = this.persistService
        .prompts()
        .slice(0, 10)
        .map((item) => ({
            id: item.id,
            old_id: item.old_id,
            titulo: { parts: [item.titulo.slice(0, this.longitud)], in: -1 },
            prompt: { parts: [item.prompt.slice(0, this.longitud)], in: -1 },
            descripcion: {
                parts: [`${item.descripcion.slice(0, this.longitud)}...`],
                in: -1,
            },
            autor: { parts: [item.autor.slice(0, this.longitud)], in: -1 },
            matchType: "exact",
            matchScore: 1.0,
            originalItem: item,
        })) as ItemEncontradoExtendido[];

    private currentSearchTerm = signal<string>("");

    promptUrl = "prompt";
    allSearchResults = signal<ItemEncontradoExtendido[]>([]);

    initSearch = signal<string>("");
    ngOnInit() {
        this.route.queryParams
            .pipe(
                filter((params: Params) => params["search"]),
                map((params: Params) => params["search"])
            )
            .subscribe((searchTerm) => {
                this.initSearch.set(searchTerm);
            });
    }

    onSearch(searchTerm: string) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { search: searchTerm.trim() },
            queryParamsHandling: "merge",
        });

        if (searchTerm.length === 0) {
            this.allSearchResults.set(this.emptySearch);
            this.currentSearchTerm.set("");
            return;
        }

        this.currentSearchTerm.set(searchTerm);
        const resultado = this.persistService.search(searchTerm!, true);

        if (resultado.found.length === 0) {
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
                matchType: found.relevanceScore === 1.0 ? "exact" : "fuzzy",
                matchScore: found.relevanceScore,
                originalItem: found.item,
            };

            // Solo procesar highlight si hay término de búsqueda
            if (searchTerm.length > 0) {
                if (found.foundIn !== "tags" && found.foundIn !== "categoria") {
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
                }
            }

            // Rellenar campos vacíos con valores por defecto
            this.fillEmptyFields(item, found.item);
            return item;
        });

        this.allSearchResults.set(salida);
    }

    private fillEmptyFields(item: ItemEncontrado, originalItem: any) {
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
    id: string;
    old_id?: number;
    titulo: { parts: string[]; in: number };
    prompt: { parts: string[]; in: number };
    descripcion: { parts: string[]; in: number };
    autor: { parts: string[]; in: number };
};

type ItemEncontradoExtendido = ItemEncontrado & {
    matchType: "exact" | "fuzzy";
    matchScore: number;
    originalItem: any; // Para mantener referencia al item original
};
