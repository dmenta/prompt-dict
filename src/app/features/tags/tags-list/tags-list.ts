import { Component, inject } from "@angular/core";
import { TagItem } from "../tag-item/tag-item";
import { PersistService } from "../../../core/services/persist.service";

@Component({
  selector: "pd-tags-list",
  imports: [TagItem],
  template: `<div class="space-y-4 w-full h-full">
    @for(tag of persistService.tags(); track tag.text) {
    <pd-tag-item [slug]="tag.slug" [text]="tag.text" [cantidad]="tag.cantidad"></pd-tag-item>
    }
  </div> `,
  styles: ``,
})
export class TagsList {
  persistService = inject(PersistService);
}
