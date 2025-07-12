import { Component, signal } from "@angular/core";
import { promptsNormalizados } from "../../../data/normalizados";
import { CategoryItem } from "../category-item/category-item";
import { CategoryInfo } from "../../models/caategory-info";
import { Prompt } from "../../models/prompt";

@Component({
  selector: "pd-categories-list",
  imports: [CategoryItem],
  template: `<div class="space-y-4  w-full h-full">
    @for(category of categories(); track category.slug) {
    <pd-category-item [info]="category"></pd-category-item>
    }
  </div> `,
  styles: ``,
})
export class CategoriesList {
  private prompts = promptsNormalizados;

  categories = signal<CategoryInfo[]>([]);

  ngOnInit() {
    const categories = this.prompts.reduce((acc: { [key: string]: CategoryInfo }, prompt: Prompt) => {
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

  private slugifyCategoryName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
}
