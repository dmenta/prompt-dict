import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { PersistService } from "../../core/services/persist.service";
import { CategoryInfo } from "../../features/categories/category-info";
import { Prompt } from "../../features/prompts/prompt";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "pd-categories",
  imports: [PromptsList],
  template: "<pd-prompts-list [info]='info()' [prompts]='prompts()'></pd-prompts-list>",
  styles: ``,
})
export class PromptsByCategory {
  private activatedRoute = inject(ActivatedRoute);

  persistService = inject(PersistService);
  slug = signal("");
  info = signal<CategoryInfo | null>(null);
  prompts = signal<Prompt[]>([] as Prompt[]);

  constructor(private title: Title) {
    this.activatedRoute.params.subscribe((params) => {
      this.slug.set(params["slug"]);

      const { info, prompts } = this.persistService.promptsOfCategory(this.slug());

      if (info) {
        this.info.set(info);
        this.prompts.set(prompts);

        this.title.setTitle(`Categoria ${info.name}`);
      }
    });
  }
}
