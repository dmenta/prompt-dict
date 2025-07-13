import { Component, input } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { Prompt } from "../prompt";
import { CategoryInfo } from "../../categories/category-info";

@Component({
  selector: "pd-prompts-list",
  imports: [DisplayPrompt],
  template: ` <div class="space-y-4  p-4  flex  flex-col h-full overflow-y-auto">
    @for(item of prompts(); track item.id) {
    <pd-display-prompt [prompt]="item"></pd-display-prompt>
    }
  </div>`,
  styles: ``,
})
export class PromptsList {
  info = input<CategoryInfo | null>(null);
  prompts = input<Prompt[]>([]);

}
