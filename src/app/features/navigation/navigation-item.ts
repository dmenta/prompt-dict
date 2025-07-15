import { Prompt } from "../prompts/prompt";

export type NavigationItem = {
  text: string;
  slug: string;
  cantidad: number;
  prompts?: Prompt[];
};
