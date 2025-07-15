import { Component, input } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { Prompt } from "../prompt";

@Component({
  selector: "pd-prompts-list",
  imports: [DisplayPrompt],
  template: `
    @for(item of prompts(); track item.id) {
    <pd-display-prompt
      [attr.tabindex]="1"
      style="scroll-margin-top: 3.75rem;; scroll-snap-align:start;"
      [prompt]="item"></pd-display-prompt>
    } @empty {
    <div class="flex  flex-col items-center justify-center h-full">
      <h1 class="text-lg font-semibold">No hay prompts</h1>
      <p class="text-not-found text-balance text-center">No se encontraron prompts para mostrar.</p>
    </div>
    }
  `,
  host: {
    class: "flex flex-col h-full w-full  gap-8  snap-y snap-mandatory",
  },
})
export class PromptsList {
  prompts = input<Prompt[]>([]);
}
