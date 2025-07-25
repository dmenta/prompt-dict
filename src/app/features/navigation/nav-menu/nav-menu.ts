import { Component, computed, inject, signal } from "@angular/core";
import { AppDataService, StorageService } from "../../../core";
import { NavItemType, navItemTypeLabels } from "../navigation-item";
import { NavList, NavListSort } from "../nav-list/nav-list";

@Component({
    selector: "pd-nav-menu",
    imports: [NavList],
    template: `
        <h5
            class="bg-drawer-header absolute  top-0  
      left-0 right-0 h-14 z-20  flex items-center pl-4 pr-5 ">
            <div
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
        </h5>
        <div class="w-full absolute top-14 bottom-0 right-0 overflow-x-hidden overflow-y-auto">
            <div class="pt-4 h-full">
                <nav pd-nav-list [list]="list()" [items]="sortedItems()"></nav>
            </div>
        </div>
    `,
})
export class NavMenu {
    private store = inject(StorageService);
    private listData = signal<NavListConfig>(
        this.store.get("navListConfig") ?? { category: "alpha", tag: "qty" }
    );

    appService = inject(AppDataService);
    list = signal<NavItemType>(this.store.get("navList") ?? "category");
    sort = computed<NavListSort>(() => this.listData()[this.list()] ?? "qty");

    sortedItems = computed(() => {
        const items =
            this.list() === "category" ? this.appService.categories() : this.appService.tags();
        const sort = this.sort();
        if (!items) {
            return [];
        }
        return items.sort((a, b) => {
            if (sort === "qty") {
                return b.prompt_count - a.prompt_count; // Sort by quantity descending
            } else {
                return a.name.localeCompare(b.name); // Sort alphabetically
            }
        });
    });

    async onClick(event: MouseEvent, list: NavItemType) {
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
