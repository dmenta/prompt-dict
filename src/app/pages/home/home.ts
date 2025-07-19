import { Component, computed, inject, signal } from "@angular/core";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { Prompt } from "../../features/prompts/prompt";
import { NavList } from "../../features/navigation/nav-list/nav-list";
import { NavItemType, navItemTypeLabels } from "../../features/navigation/navigation-item";
import { Drawer, MainHeader, PersistService, StorageService } from "../../core";

@Component({
    selector: "pd-home",
    imports: [PromptsList, MainHeader, Drawer, NavList],
    template: `
        <header pd-main-header (open)="drawer.show()"></header>
        <div pd-drawer class="w-fit  select-none " #drawer>
            <div
                drawer-title
                class="flex items-center justify-between w-full"
                [class.flex-row]="list() === 'category'"
                [class.flex-row-reverse]="list() === 'tag'">
                <span class="font-semibold text-list-name">{{ activo() }}</span>
                <span
                    class="opacity-85 font-light hover:opacity-100"
                    (click)="onClick($event, list() === 'category' ? 'tag' : 'category')"
                    >{{ inactivo() }}</span
                >
            </div>
            <nav pd-nav-list [list]="list()"></nav>
        </div>
        <div class="flex flex-row  md:ml-72">
            <ul pd-prompts-list class="px-4 md:px-8 py-4" [prompts]="prompts()"></ul>
        </div>
    `,
    host: {
        class: " w-full ",
    },
})
export class Home {
    private store = inject(StorageService);
    private persistService = inject(PersistService);
    list = signal<NavItemType>(this.store.get<NavItemType>("navList") ?? "category");
    prompts = signal<Prompt[]>([] as Prompt[]);

    onClick(event: MouseEvent, list: NavItemType) {
        event.stopPropagation();
        this.list.set(list);
        this.store.save("navList", list);
    }

    inactivo = computed(() => {
        return this.list() === "category"
            ? navItemTypeLabels["tag"]
            : navItemTypeLabels["category"];
    });

    activo = computed(() => {
        return navItemTypeLabels[this.list()];
    });

    constructor() {
        this.prompts.set(this.persistService.prompts());
    }
}
