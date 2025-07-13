import { Prompt } from "../prompts/prompt";

export type Tag = {
  text: string;
  slug: string;
  cantidad: number;
  prompts?: Prompt[];
};
