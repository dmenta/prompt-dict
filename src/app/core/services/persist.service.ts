import { Injectable, signal } from "@angular/core";
import promptsNormalizados from "../../../data/normalizados";
import { Prompt } from "../../features/prompts/prompt";
import { NavigationItem } from "../../features/navigation/navigation-item";

@Injectable({
  providedIn: "root",
})
export class PersistService {
  private promptsList = promptsNormalizados;
  public prompts = signal(this.promptsList);
  public categories = signal<NavigationItem[]>([]);
  public tags = signal<NavigationItem[]>([]);

  constructor() {
    this.initializeCategories();
    this.initializeTags();
  }

  private initializeCategories() {
    const categoriesSet = new Set<string>();
    this.prompts().forEach((prompt) => {
      categoriesSet.add(prompt.categoria);
    });
    this.categories.set(
      Array.from(categoriesSet)
        .map((categoria) => {
          const promptsForCategory = this.prompts().filter((prompt) => prompt.categoria.localeCompare(categoria) === 0);
          return {
            text: categoria,
            slug: this.slugify(categoria),
            cantidad: promptsForCategory.length,
            prompts: promptsForCategory,
          };
        })
        .sort((a, b) => a.text.localeCompare(b.text))
    );
  }

  private initializeTags() {
    const tagsSet = new Set<string>();
    this.prompts().forEach((prompt) => {
      prompt.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    });

    this.tags.set(
      Array.from(tagsSet)
        .map((tag) => {
          const promptsForTag = this.prompts().filter((prompt) => prompt.tags.includes(tag));
          return {
            text: tag,
            slug: this.slugify(tag),
            cantidad: promptsForTag.length,
            prompts: promptsForTag,
          };
        })
        .sort((a, b) => a.text.localeCompare(b.text))
    );
  }

  byCategory(slug: string): { name: string; prompts: Prompt[] } {
    const category = this.categories().find((cat) => cat.slug === slug);

    if (!category) {
      return { name: "", prompts: [] };
    }
    return { name: category.text, prompts: category.prompts || [] };
  }

  byTag(slug: string): { name: string; prompts: Prompt[] } {
    const tag = this.tags().find((tag) => tag.slug === slug);

    if (!tag) {
      return { name: "", prompts: [] };
    }

    return { name: tag.text, prompts: tag.prompts || [] };
  }

  search(searchTerm: string): { info: string | null; prompts: Prompt[] } {
    const prompts = this.prompts().filter(
      (prompt) =>
        prompt.prompt.toLowerCase().indexOf(searchTerm) > -1 ||
        prompt.tags.some((tag) => tag.toLowerCase().indexOf(searchTerm) > -1)
    );

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

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
}
