import { Component, input } from "@angular/core";
import { CategoryInfo } from "../../category-info";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "pd-category-item",
  imports: [RouterLink, RouterLinkActive],
  template: ` <a [routerLink]="['./categories', info().slug]" routerLinkActive #rla="routerLinkActive"
    ><button
      [disabled]="rla.isActive"
      class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background
      transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-2 py-2  w-full gap-2">
      <span
        class="rounded-full bg-azul-400/70  w-6 h-6 pb-0.5 text-white text-sm flex flex-row items-center justify-center"
        >{{ info().numberOfPrompts }}</span
      >
      {{ info().name }}
    </button></a
  >`,
  styles: ``,
})
export class CategoryItem {
  info = input<CategoryInfo>({ name: "", slug: "", numberOfPrompts: 0, authors: [], tags: [] });
}
