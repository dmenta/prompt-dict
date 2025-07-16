import { Component, computed, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { QuantityBagde } from "../../../core/components/quantity-bagde/quantity-bagde";

@Component({
    selector: "[pd-nav-item]",
    imports: [RouterLink, RouterLinkActive, QuantityBagde],
    template: ` <a
        [routerLink]="['./prompts']"
        [queryParams]="queryParam()"
        routerLinkActive
        #rla="routerLinkActive"
        class="select-none"
        ><button
            [disabled]="rla.isActive"
            class="inline-flex items-center whitespace-nowrap rounded-md font-regular ring-offset-background
      transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50 hover:bg-item-hover hover:text-item-hover-contrast h-10 px-4 py-8  w-full gap-2">
            <pd-quantity-bagde [quantity]="cantidad()"></pd-quantity-bagde>
            <span class="lowercase first-letter:uppercase"> {{ text() }}</span>
        </button></a
    >`,
    host: {
        class: "w-full block",
    },
})
export class NavItem {
    paramName = input<string | null>(null);
    slug = input<string | null>(null);

    queryParam = computed(() => {
        const name = this.paramName() ?? "tag";
        return { [name]: this.slug() };
    });

    text = input("");
    cantidad = input(0);
}
