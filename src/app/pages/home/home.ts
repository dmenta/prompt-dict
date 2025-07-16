import { Component, computed, inject, signal } from "@angular/core";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { PersistService } from "../../core/services/persist.service";
import { Title } from "@angular/platform-browser";
import { Prompt } from "../../features/prompts/prompt";
import { ActivatedRoute, Params } from "@angular/router";
import { MainHeader } from "../../core/components/header/main-header";
import { Drawer } from "../../core/components/drawer/drawer";
import { NavList } from "../../features/navigation/nav-list/nav-list";

@Component({
    selector: "pd-home",
    imports: [PromptsList, MainHeader, Drawer, NavList],
    template: `
        <header pd-main-header (open)="drawer.show()"></header>
        <div pd-drawer class="w-fit  select-none" #drawer>
            <div
                drawer-title
                class="flex items-center justify-between w-full"
                [class.flex-row]="list() === 'category'"
                [class.flex-row-reverse]="list() === 'tag'">
                <span class="font-semibold text-list-name" (click)="$event.stopImmediatePropagation()">{{
                    activo()
                }}</span>
                <span
                    class="opacity-85 font-light hover:opacity-100"
                    (click)="onClick($event, list() === 'category' ? 'tag' : 'category')"
                    >{{ inactivo() }}</span
                >
            </div>
            <nav pd-nav-list [list]="list()"></nav>
        </div>
        <div class="flex flex-row w-full">
            <ul pd-prompts-list class="p-4 " [prompts]="prompts()"></ul>
        </div>
    `,
    host: {
        class: " w-full ",
    },
})
export class Home {
    private persistService = inject(PersistService);
    private activatedRoute = inject(ActivatedRoute);

    list = signal<"category" | "tag">("category");
    prompts = signal<Prompt[]>([] as Prompt[]);

    onClick(event: MouseEvent, what: "category" | "tag") {
        event.stopPropagation();
        this.list.set(what);
    }

    inactivo = computed(() => {
        return this.list() === "category" ? "Etiquetas" : "Categorías";
    });

    activo = computed(() => {
        return this.list() === "category" ? "Categorías" : "Etiquetas";
    });

    constructor(private title: Title) {
        this.prompts.set(this.persistService.prompts());
        this.title.setTitle("Prompter");
    }
}
