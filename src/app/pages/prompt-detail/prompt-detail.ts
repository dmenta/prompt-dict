import { Component, inject, signal } from "@angular/core";
import { Prompt } from "../../features/prompts/prompt";
import { PersistService } from "../../core/services/persist.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DisplayPrompt } from "../../features/prompts/display-prompt/display-prompt";

@Component({
  selector: "pd-prompt-detail",
  imports: [DisplayPrompt],
  template: `@if(prompt(); as promptOk) {
    <pd-display-prompt [attr.tabindex]="1" [prompt]="promptOk"></pd-display-prompt>}@else {
    <div class="flex flex-col items-center justify-center h-full">
      <h1 class="text-lg font-semibold">Prompt no encontrado</h1>
      <p class="text-not-found text-balance text-center">El prompt que buscas no existe o ha sido eliminado.</p>
    </div>
    }`,
  host: {
    class: "w-full p-4",
  },
})
export class PromptDetail {
  persistService = inject(PersistService);
  private activatedRoute = inject(ActivatedRoute);
  prompt = signal<Prompt | null>(null);

  constructor(private title: Title) {
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = Number(params["id"]);
      if (Number.isInteger(id) && Number.isFinite(id)) {
        const prompt = this.persistService.byId(id);
        this.prompt.set(prompt);

        this.title.setTitle(`Prompt | ${this.prompt()?.titulo || "No encontrado"}`);
      }
    });
  }
}
