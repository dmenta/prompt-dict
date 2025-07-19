import { Component, computed, inject, input } from "@angular/core";
import { NavItem } from "../nav-item/nav-item";
import { AppDataService } from "../../../core";
import { NavItemType } from "../navigation-item";

@Component({
    selector: "nav[pd-nav-list], ul[pd-nav-list], ol[pd-nav-list]",
    imports: [NavItem],
    template: `
        @for(item of sortedItems(); track item.slug) {
        <li
            pd-nav-item
            [slug]="item.slug"
            [text]="item.name"
            [paramName]="list()"
            [cantidad]="item.prompt_count"></li>
        }
    `,
    host: {
        class: "space-y-1 w-full h-full",
    },
})
export class NavList {
    persistService = inject(AppDataService);

    list = input<NavItemType>("category");

    sort = input<NavListSort>("qty");

    items = computed(() => {
        if (this.list() === "category") {
            return this.persistService.categories();
        } else {
            return this.persistService.tags();
        }
    });
    sortedItems = computed(() => {
        return this.items().sort((a, b) => {
            if (this.sort() === "qty") {
                return b.prompt_count - a.prompt_count; // Sort by quantity descending
            } else {
                return a.name.localeCompare(b.name); // Sort alphabetically
            }
        });
    });
}

export type NavListSort = "qty" | "alpha";
