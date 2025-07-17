import { Prompt } from "../prompts/prompt";

export type NavigationItem = {
    text: string;
    slug: string;
    cantidad: number;
    prompts?: Prompt[];
};

export type NavItemType = "category" | "tag";

export const navItemTypeLabels: Record<NavItemType, string> = {
    category: "Categoría",
    tag: "Etiqueta",
};
