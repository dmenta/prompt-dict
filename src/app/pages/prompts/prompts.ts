import { Component, inject, signal } from "@angular/core";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { PersistService } from "../../core/services/persist.service";
import { Title } from "@angular/platform-browser";
import { Prompt } from "../../features/prompts/prompt";
import { ActivatedRoute, Params } from "@angular/router";
import { SectionHeader } from "../../core/components/header/section-header";
import { distinctUntilChanged, filter, map } from "rxjs";
import { StickyHeader } from "../../core/components/header/sticky-header";

@Component({
    selector: "pd-prompts",
    imports: [PromptsList, SectionHeader],
    template: `
        <header pd-section-header [titulo]="titulo()" [subtitulo]="subtitulo()"></header>
        <div class="flex flex-row w-full">
            <ul pd-prompts-list class="p-4 " [prompts]="prompts()"></ul>
        </div>
    `,
    host: {
        class: " w-full ",
    },
})
export class Prompts {
    persistService = inject(PersistService);
    private activatedRoute = inject(ActivatedRoute);

    titulo = signal<string>("Sin información");
    subtitulo = signal<string>("Indique una etiqueta o categoría para mostrar");

    prompts = signal<Prompt[]>([] as Prompt[]);

    constructor(private title: Title) {
        this.activatedRoute.queryParams
            .pipe(
                filter((params: Params) => params["tag"] || params["category"]),
                map((params: Params) => ({
                    tag: <string>(params["tag"]?.trim().toLowerCase() || ""),
                    category: <string>(params["category"]?.trim().toLowerCase() || ""),
                })),
                filter(({ tag, category }) => tag.length > 0 || category.length > 0),
                distinctUntilChanged((prev, curr) => prev.tag === curr.tag && prev.category === curr.category),
                map(({ tag, category }) =>
                    tag.length > 0
                        ? { itemPrompts: this.persistService.byTag(tag), slug: tag, type: "etiqueta" }
                        : { itemPrompts: this.persistService.byCategory(category), slug: category, type: "categoría" }
                )
            )
            .subscribe(({ itemPrompts, slug, type }) => {
                if (!itemPrompts) {
                    this.titulo.set(slug);
                    this.subtitulo.set(`${this.titleCase(type)} desconocida o no encontrada`);
                } else {
                    this.init(type, itemPrompts);
                }
                this.title.setTitle(`${this.titleCase(type)} | ${itemPrompts?.name ?? slug}`);
            });
    }

    private init(type: string, itemPrompts: { name: string; prompts: Prompt[] }) {
        const prompts = itemPrompts.prompts;
        this.prompts.set(prompts);
        this.titulo.set(itemPrompts.name);
        const promptsCount = prompts.length;
        this.subtitulo.set(this.resolvedSubtitulo(promptsCount, type));
    }

    private titleCase(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    private resolvedSubtitulo(numItems: number, type: string): string {
        type = type.toLowerCase();
        const mensajeCantidad =
            numItems === 0
                ? "Ningún prompt asociado"
                : numItems === 1
                ? "1 prompt asociado"
                : `${numItems.toFixed(0)} prompts asociados`;

        return `${mensajeCantidad} a esta ${type}`;
    }
}
