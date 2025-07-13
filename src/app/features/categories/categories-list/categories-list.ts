import { Component, inject } from "@angular/core";
import { CategoryItem } from "./category-item/category-item";
import { PersistService } from "../../../core/services/persist.service";

@Component({
  selector: "pd-categories-list",
  imports: [CategoryItem],
  template: `<div class="space-y-4  w-full h-full">
    @for(category of persistService. categories(); track category.slug) {
    <pd-category-item [info]="category"></pd-category-item>
    }
  </div> `,
  styles: ``,
})
export class CategoriesList {
  persistService = inject(PersistService);
}
