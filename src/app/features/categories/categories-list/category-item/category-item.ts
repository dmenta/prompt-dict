import { Component, input } from "@angular/core";
import { CategoryInfo } from "../../category-info";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { QuantityBagde } from "../../../../core/components/quantity-bagde/quantity-bagde";

@Component({
  selector: "pd-category-item",
  imports: [RouterLink, RouterLinkActive, QuantityBagde],
  template: ` <a
    [routerLink]="['./']"
    [queryParams]="{ category: info().slug }"
    routerLinkActive
    class="select-none "
    #rla="routerLinkActive"
    ><button
      [disabled]="rla.isActive"
      class="inline-flex items-center whitespace-nowrap rounded-md  font-medium ring-offset-background
      transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-2 py-2  w-full gap-2">
      <pd-quantity-bagde [quantity]="info().numberOfPrompts"></pd-quantity-bagde>
      <span class="lowercase first-letter:uppercase"> {{ info().name }}</span>
    </button></a
  >`,
  styles: ``,
})
export class CategoryItem {
  info = input<CategoryInfo>({ name: "", slug: "", numberOfPrompts: 0, authors: [], tags: [] });
}
