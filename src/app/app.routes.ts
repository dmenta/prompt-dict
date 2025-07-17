import { Routes } from "@angular/router";
import {
    categoryResolve,
    categoryTitleResolve,
    promptResolve,
    promptTitleResolve,
    tagResolve,
    tagTitleResolve,
} from "./core/services/resolvers";
import { navItemTypeLabels } from "./features/navigation/navigation-item";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages/home/home").then((m) => m.Home),
        title: "Prompter | Inicio",
    },
    {
        path: "category/:id",
        loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
        title: categoryTitleResolve,
        resolve: {
            item: categoryResolve,
            type: () => navItemTypeLabels["category"],
        },
    },
    {
        path: "tag/:id",
        loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
        title: tagTitleResolve,
        resolve: {
            item: tagResolve,
            type: () => navItemTypeLabels["tag"],
        },
    },
    {
        path: "prompt/:id",
        loadComponent: () => import("./pages/prompt-detail/prompt-detail").then((m) => m.PromptDetail),
        title: promptTitleResolve,
        resolve: {
            prompt: promptResolve,
        },
    },

    {
        path: "searching",
        loadComponent: () => import("./pages/searching/searching").then((m) => m.Searching),
        title: "Prompter | Búsqueda",
    },

    {
        path: "home",
        redirectTo: "",
        pathMatch: "full",
    },

    { path: "**", redirectTo: "" }, // Redirect to home for any unknown routes
];
