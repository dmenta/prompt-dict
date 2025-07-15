import { Component, inject, signal } from "@angular/core";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { PersistService } from "../../core/services/persist.service";
import { Title } from "@angular/platform-browser";
import { Prompt } from "../../features/prompts/prompt";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "pd-prompts",
  imports: [PromptsList],
  template: `<pd-prompts-list class="p-4" [prompts]="prompts()"></pd-prompts-list>`,
  host: {
    class: " w-full",
  },
})
export class Prompts {
  persistService = inject(PersistService);
  private activatedRoute = inject(ActivatedRoute);

  prompts = signal<Prompt[]>([] as Prompt[]);

  constructor(private title: Title) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["search"]) {
        const searchTerm = <string>params["search"].trim().toLowerCase();
        this.title.setTitle(`Búsqueda | Resultado para '${searchTerm}'`);
        this.prompts.set(this.persistService.search(searchTerm).prompts || []);
      } else if (params["tag"]) {
        const tagPrompts = this.persistService.tags().filter((tag) => tag.slug === params["tag"]);
        this.title.setTitle(`Etiqueta | ${tagPrompts[0].text}`);
        const prompts = tagPrompts[0].prompts || [];
        this.prompts.set(prompts);
      } else if (params["category"]) {
        const { name, prompts } = this.persistService.byCategory(params["category"]);
        if (name.length > 0) {
          this.title.setTitle(`Categoría | ${name}`);
          this.prompts.set(prompts);
        } else {
          this.title.setTitle("Categoría no encontrada");
          this.prompts.set([]);
        }
      } else {
        this.prompts.set(this.persistService.prompts());
        this.title.setTitle("Todos los prompts");
      }
    });
  }
}
