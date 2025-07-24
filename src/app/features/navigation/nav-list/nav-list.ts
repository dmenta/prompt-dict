import { Component, input } from "@angular/core";
import { NavItem } from "../nav-item/nav-item";
import { NavigationItem, NavItemType } from "../navigation-item";

@Component({
    selector: "nav[pd-nav-list], ul[pd-nav-list], ol[pd-nav-list]",
    imports: [NavItem],
    template: `
        @for(item of items(); track item.slug) {
        <li
            pd-nav-item
            [slug]="item.slug"
            [name]="item.name"
            [paramName]="list()"
            [cantidad]="item.prompt_count"></li>
        }
    `,
    host: {
        class: "space-y-1 w-full h-full",
    },
})
export class NavList {
    list = input<NavItemType>("category");

    items = input<NavigationItem[]>();
}

export type NavListSort = "qty" | "alpha";
