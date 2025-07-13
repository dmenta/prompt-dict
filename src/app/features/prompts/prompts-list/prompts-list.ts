import { Component, signal } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { promptsNormalizados } from "../../../../data/normalizados";
import { Prompt } from "../prompt";

@Component({
  selector: "pd-prompts-list",
  imports: [DisplayPrompt],
  template: `
    <div class="space-y-4  p-4  flex  flex-col h-full overflow-y-auto">
      @for(item of prompts(); track item.id) {
      <pd-display-prompt [prompt]="item"></pd-display-prompt>
      }
    </div>
  `,
  styles: ``,
})
export class PromptsList {
  private promptsList = promptsNormalizados;
  prompts = signal<Prompt[]>(this.promptsList);
}
