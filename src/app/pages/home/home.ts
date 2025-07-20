import { Component, computed, inject, signal } from "@angular/core";
import { PromptsList, NavList, NavListSort, NavItemType, navItemTypeLabels } from "../../features";
import { Drawer, MainHeader, StorageService, AppDataService, FirestorePrompt } from "../../core";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";

@Component({
    selector: "pd-home",
    imports: [PromptsList, MainHeader, Drawer, NavList, InfiniteScrollDirective],
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
        @if (prompts().length > 0) {
        <div
            infiniteScroll
            [infiniteScrollDistance]="scrollDistance"
            [infiniteScrollUpDistance]="scrollUpDistance"
            [infiniteScrollThrottle]="throttle"
            (scrolled)="onScrollDown()">
            <div class="flex flex-row  md:ml-72">
                <ul pd-prompts-list class="px-6 py-6" [prompts]="prompts()"></ul>
            </div>
        </div>
        } @else {
        <div class="flex flex-col  md:ml-72 items-center justify-center h-[80svh]">
            <span class="relative inline-flex mb-2">
                <span class="flex size-5"
                    ><span
                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span
                    ><span class="relative inline-flex size-5 rounded-full bg-primary-light"></span
                ></span>
            </span>
            <span class="opacity-95">cargando</span>
            <span class="opacity-95">prompts</span>
        </div>
        }
    `,
    host: {
        class: " w-full ",
    },
})
export class Home {
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;
    direction = "";
    private store = inject(StorageService);
    private listData = signal<NavListConfig>(
        this.store.get("navListConfig") ?? { category: "alpha", tag: "qty" }
    );
    persistService = inject(AppDataService);

    prompts = signal<FirestorePrompt[]>([]);

    list = signal<NavItemType>(this.store.get("navList") ?? "category");
    sort = computed<NavListSort>(() => this.listData()[this.list()] ?? "qty");

    constructor() {
        this.persistService.prompts().then((prompts) => {
            this.prompts.set(prompts);
        });
    }

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

    onScrollDown() {
        this.persistService.prompts().then((prompts) => {
            this.prompts.set(prompts);
        });
    }
}

type NavListConfig = Record<NavItemType, NavListSort>;
