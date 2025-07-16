import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home").then((m) => m.Home),
  },

  {
    path: "prompts",
    loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
  },

  {
    path: "prompt/:id",
    loadComponent: () => import("./pages/prompt-detail/prompt-detail").then((m) => m.PromptDetail),
  },

  {
    path: "searching",
    loadComponent: () => import("./pages/searching/searching").then((m) => m.Searching),
  },

  {
    path: "home",
    redirectTo: "",
    pathMatch: "full",
  },

  { path: "**", redirectTo: "" }, // Redirect to home for any unknown routes
];
