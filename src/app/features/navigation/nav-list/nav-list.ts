import { Component, computed, inject, input } from "@angular/core";
import { NavItem } from "../nav-item/nav-item";
import { PersistService } from "../../../core/services/persist.service";
import { NavItemType } from "../navigation-item";

@Component({
    selector: "nav[pd-nav-list], ul[pd-nav-list], ol[pd-nav-list]",
    imports: [NavItem],
    template: `
        @for(item of items(); track item.slug) {
        <li pd-nav-item [slug]="item.slug" [text]="item.text" [paramName]="list()" [cantidad]="item.cantidad"></li>
        }
    `,
    host: {
        class: "space-y-1 w-full h-full",
    },
})
export class NavList {
    persistService = inject(PersistService);

    list = input<NavItemType>("category");

    items = computed(() => {
        if (this.list() === "category") {
            return this.persistService.categories();
        } else {
            return this.persistService.tags();
        }
    });
}
