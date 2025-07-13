import { Injectable, signal } from "@angular/core";
import promptsNormalizados from "../../../data/normalizados";
import { CategoryInfo } from "../../features/categories/category-info";
import { Prompt } from "../../features/prompts/prompt";

@Injectable({
  providedIn: "root",
})
export class PersistService {
  private promptsList = promptsNormalizados;

  public prompts = signal(this.promptsList);
  public categories = signal<CategoryInfo[]>([]);

  constructor() {
    const categories = this.prompts().reduce((acc: { [key: string]: CategoryInfo }, prompt: Prompt) => {
      const categoryName = prompt.categoria;
      const slug = this.slugifyCategoryName(categoryName)!;
      if (!acc[slug]) {
        acc[slug] = {
          name: categoryName,
          slug: slug,
          numberOfPrompts: 0,
          authors: [] as string[],
          tags: [] as string[],
        };
      }

      acc[slug].numberOfPrompts++;
      if (prompt.autor && !acc[slug].authors.includes(prompt.autor)) {
        acc[slug].authors.push(prompt.autor);
      }
      if (prompt.tags.length > 0) {
        prompt.tags.forEach((tag) => {
          if (!acc[slug].tags.includes(tag)) {
            acc[slug].tags.push(tag);
          }
        });
      }

      return acc;
    }, {} as { [key: string]: CategoryInfo });

    this.categories.set(Object.values(categories).sort((a, b) => a.name.localeCompare(b.name)));
  }

  promptsOfCategory(slug: string): { info: CategoryInfo; prompts: Prompt[] } {
    const category = this.categories().find((cat) => cat.slug === slug);

    if (!category) {
      return { info: { name: "", slug: "", numberOfPrompts: 0, authors: [], tags: [] }, prompts: [] };
    }
    return { info: category, prompts: this.prompts().filter((prompt) => prompt.categoria === category.name) };
  }

  private slugifyCategoryName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
}
