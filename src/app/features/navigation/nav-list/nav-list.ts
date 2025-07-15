import { Component, computed, inject, input } from "@angular/core";
import { NavItem } from "../nav-item/nav-item";
import { PersistService } from "../../../core/services/persist.service";

@Component({
  selector: "pd-nav-list",
  imports: [NavItem],
  template: `<div class="space-y-4 w-full h-full">
    @for(item of items(); track item.slug) {
    <pd-nav-item [slug]="item.slug" [text]="item.text" [paramName]="list()" [cantidad]="item.cantidad"></pd-nav-item>
    }
  </div> `,
  styles: ``,
})
export class NavList {
  persistService = inject(PersistService);

  list = input<"category" | "tag">("category");

  items = computed(() => {
    if (this.list() === "category") {
      return this.persistService.categories();
    } else {
      return this.persistService.tags();
    }
  });
}
