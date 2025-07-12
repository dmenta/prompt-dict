import { Component, signal } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { Prompt } from "../../models/prompt";
import { promptsNormalizados } from "../../../data/normalizados";

@Component({
  selector: "pd-prompts-list",
  imports: [DisplayPrompt],
  template: `
    <div class="space-y-4  p-4 w-screen h-full flex flex-col overflow-y-auto">
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
