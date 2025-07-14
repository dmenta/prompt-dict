import { Component, input } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { Prompt } from "../prompt";
import { CategoryInfo } from "../../categories/category-info";

@Component({
  selector: "pd-prompts-list",
  imports: [DisplayPrompt],
  template: ` <div
    style="scroll-snap-type: y mandatory"
    class="space-y-2 mt-1 p-4  flex  flex-col h-full overflow-y-auto">
    @for(item of prompts(); track item.id) {
    <pd-display-prompt [attr.tabindex]="1" style="scroll-snap-align:start;" [prompt]="item"></pd-display-prompt>
    }
  </div>`,
  styles: ``,
})
export class PromptsList {
  info = input<CategoryInfo | null>(null);
  prompts = input<Prompt[]>([]);
}
