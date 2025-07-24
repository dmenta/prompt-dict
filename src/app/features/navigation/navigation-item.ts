import { Prompt } from "../../core";

export type NavigationItem = {
    name: string;
    slug: string;
    prompt_count: number;
    prompts?: Prompt[];
};

export type NavItemType = "category" | "tag";

export const navItemTypeLabels: Record<NavItemType, { title: string; lowercase: string }> = {
    category: { title: "Categoría", lowercase: "categoría" },
    tag: { title: "Etiqueta", lowercase: "etiqueta" },
};
