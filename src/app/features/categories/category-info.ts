import { Prompt } from "../prompts/prompt";

export type CategoryInfo = {
  name: string;
  slug: string;
  numberOfPrompts: number;
  authors: string[];
  tags: string[];
  prompts?: Prompt[];
};
