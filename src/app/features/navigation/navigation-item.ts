import { Prompt } from "../prompts/prompt";

export type NavigationItem = {
    text: string;
    slug: string;
    cantidad: number;
    prompts?: Prompt[];
};

export type NavItemType = "category" | "tag";

export const navItemTypeLabels: Record<NavItemType, { title: string; lowercase: string }> = {
    category: { title: "Categoría", lowercase: "categoría" },
    tag: { title: "Etiqueta", lowercase: "etiqueta" },
};
