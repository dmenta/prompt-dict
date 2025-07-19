import { Component, computed, inject, signal } from "@angular/core";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { Prompt } from "../../features/prompts/prompt";
import { NavList, NavListSort } from "../../features/navigation/nav-list/nav-list";
import { NavItemType, navItemTypeLabels } from "../../features/navigation/navigation-item";
import { Drawer, MainHeader, StorageService, AppDataService } from "../../core";

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
                <div>
                    <span class="font-semibold text-list-name  pr-1">{{ activo() }}</span>
                    <button class="cursor-pointer text-xs opacity-85" (click)="onSortChange()">
                        [{{ sort() === "qty" ? "Num" : "A-Z" }}]
                    </button>
                </div>
                <span
                    class="opacity-85 font-light hover:opacity-100"
                    (click)="onClick($event, list() === 'category' ? 'tag' : 'category')"
                    >{{ inactivo() }}</span
                >
            </div>
            <nav pd-nav-list [list]="list()" [sort]="sort()"></nav>
        </div>
        <div class="flex flex-row  md:ml-72">
            <ul pd-prompts-list class="px-6 py-6" [prompts]="prompts()"></ul>
        </div>
    `,
    host: {
        class: " w-full ",
    },
})
export class Home {
    private store = inject(StorageService);
    private listData = signal<NavListConfig>(
        this.store.get("navListConfig") ?? { category: "alpha", tag: "qty" }
    );
    persistService = inject(AppDataService);

    prompts = computed<Prompt[]>(() => this.persistService.prompts());

    list = signal<NavItemType>(this.store.get("navList") ?? "category");
    sort = computed<NavListSort>(() => this.listData()[this.list()] ?? "qty");

    onClick(event: MouseEvent, list: NavItemType) {
        event.stopPropagation();
        this.list.set(list);
        this.store.save("navList", list);
    }

    onSortChange() {
        const currentSort = this.sort();
        const newSort = currentSort === "qty" ? "alpha" : "qty";
        this.listData.update((data) => ({
            ...data,
            [this.list()]: newSort,
        }));
        this.store.save("navListConfig", this.listData());
    }

    inactivo = computed(() => {
        return this.list() === "category"
            ? navItemTypeLabels["tag"].title
            : navItemTypeLabels["category"].title;
    });

    activo = computed(() => {
        return navItemTypeLabels[this.list()].title;
    });
}

type NavListConfig = Record<NavItemType, NavListSort>;
