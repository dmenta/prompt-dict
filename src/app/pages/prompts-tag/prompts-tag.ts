import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PersistService } from "../../core/services/persist.service";
import { Prompt } from "../../features/prompts/prompt";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "pd-prompts-tag",
  imports: [PromptsList],
  template: "<pd-prompts-list  [prompts]='prompts()'></pd-prompts-list>",
})
export class PromptsByTag {
  private activatedRoute = inject(ActivatedRoute);

  persistService = inject(PersistService);
  slug = signal("");
  info = signal<string | null>(null);
  prompts = signal<Prompt[]>([] as Prompt[]);

  constructor(private title: Title) {
    this.activatedRoute.params.subscribe((params) => {
      this.slug.set(params["slug"]);

      const tagPrompts = this.persistService.tags().filter((tag) => tag.slug === this.slug());
      this.title.setTitle(`Etiquetados como ${tagPrompts[0].text}`);

      const prompts = tagPrompts[0].prompts || [];
      this.prompts.set(prompts);
    });
  }
}
