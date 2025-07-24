import { Routes } from "@angular/router";
import { categoryResolve, promptResolve, tagResolve } from "./core";
import { navItemTypeLabels } from "./features";
import { AuthGuard } from "./core";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages").then((m) => m.Home),
        title: "Inicio | Prompter",
    },
    {
        path: "prompts/create",
        loadComponent: () => import("./pages").then((m) => m.CreatePromptPage),
        title: "Crear Prompt | Prompter",
    },
    {
        path: "category/:id",
        loadComponent: () => import("./pages").then((m) => m.Prompts),
        resolve: { item: categoryResolve, type: () => navItemTypeLabels["category"] },
    },
    {
        path: "tag/:id",
        loadComponent: () => import("./pages").then((m) => m.Prompts),
        resolve: { item: tagResolve, type: () => navItemTypeLabels["tag"] },
    },
    {
        path: "prompt/:id",
        loadComponent: () => import("./pages").then((m) => m.PromptDetail),
        resolve: { prompt: promptResolve },
    },
    {
        path: "searching",
        loadComponent: () => import("./pages").then((m) => m.Searching),
        title: "Búsqueda | Prompter",
    },
    {
        path: "admin",
        loadComponent: () => import("./pages").then((m) => m.AdminPage),
        title: "Administración | Prompter",
        canActivate: [AuthGuard],
    },
    {
        path: "home",
        redirectTo: "",
        pathMatch: "full",
    },

    { path: "**", redirectTo: "" }, // Redirect to home for any unknown routes
];
