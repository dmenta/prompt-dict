import { Routes } from "@angular/router";
import { categoryResolve, promptResolve, tagResolve } from "./core";
import { navItemTypeLabels } from "./features";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages/home/home").then((m) => m.Home),
        title: "Inicio | Prompter",
    },
    {
        path: "prompts/create",
        loadComponent: () =>
            import("./pages/create-prompt/create-prompt.page").then((m) => m.CreatePromptPage),
        title: "Crear Prompt | Prompter",
    },
    {
        path: "category/:id",
        loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
        resolve: { item: categoryResolve, type: () => navItemTypeLabels["category"] },
    },
    {
        path: "tag/:id",
        loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
        resolve: { item: tagResolve, type: () => navItemTypeLabels["tag"] },
    },
    {
        path: "prompt/:id",
        loadComponent: () =>
            import("./pages/prompt-detail/prompt-detail").then((m) => m.PromptDetail),
        resolve: { prompt: promptResolve },
    },
    {
        path: "searching",
        loadComponent: () => import("./pages/searching/searching").then((m) => m.Searching),
        title: "Búsqueda | Prompter",
    },
    {
        path: "admin",
        loadComponent: () => import("./pages/admin/admin.page").then((m) => m.AdminPage),
        title: "Administración | Prompter",
    },
    {
        path: "home",
        redirectTo: "",
        pathMatch: "full",
    },

    { path: "**", redirectTo: "" }, // Redirect to home for any unknown routes
];
