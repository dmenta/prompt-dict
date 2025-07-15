import { Injectable, signal } from "@angular/core";
import promptsNormalizados from "../../../data/normalizados";
import { CategoryInfo } from "../../features/categories/category-info";
import { Prompt } from "../../features/prompts/prompt";
import { Tag } from "../../features/tags/tag";

@Injectable({
  providedIn: "root",
})
export class PersistService {
  private promptsList = promptsNormalizados;
  public prompts = signal(this.promptsList);
  public categories = signal<CategoryInfo[]>([]);
  public tags = signal<Tag[]>([]);

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

    const tagsSet = new Set<string>();
    this.categories().forEach((category) => {
      category.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    });

    this.tags.set(
      Array.from(tagsSet)
        .map((tag) => {
          const promptsForTag = this.prompts().filter((prompt) => prompt.tags.includes(tag));
          return {
            text: tag,
            slug: tag
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, ""),
            cantidad: promptsForTag.length,
            prompts: promptsForTag,
          };
        })
        .sort((a, b) => a.text.localeCompare(b.text))
    );
  }

  byCategory(slug: string): { info: CategoryInfo; prompts: Prompt[] } {
    const category = this.categories().find((cat) => cat.slug === slug);

    if (!category) {
      return { info: { name: "", slug: "", numberOfPrompts: 0, authors: [], tags: [] }, prompts: [] };
    }
    return { info: category, prompts: this.prompts().filter((prompt) => prompt.categoria === category.name) };
  }

  byTag(tag: string): { info: string | null; prompts: Prompt[] } {
    const prompts = this.prompts().filter((prompt) => prompt.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));

    if (prompts.length === 0) {
      return { info: null, prompts: [] };
    }

    return {
      info: tag,
      prompts: prompts,
    };
  }

  search(searchTerm: string): { info: string | null; prompts: Prompt[] } {
    const prompts = this.prompts().filter((prompt) => prompt.prompt.toLowerCase().indexOf(searchTerm) > -1);

    console.log("Search results for:", searchTerm, "Found prompts:", prompts.length);
    if (prompts.length === 0) {
      return { info: searchTerm, prompts: [] };
    }

    return {
      info: searchTerm,
      prompts: prompts,
    };
  }

  byId(id: number) {
    return this.prompts().find((prompt) => prompt.id === id) || null;
  }

  private slugifyCategoryName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
}
