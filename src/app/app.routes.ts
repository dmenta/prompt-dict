import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
  },

  {
    path: "prompts",
    redirectTo: "",
    pathMatch: "full",
  },
  //prompts por categories usando el slug
  {
    path: "categories/:slug",
    loadComponent: () => import("./pages/prompts-category/prompts-category").then((m) => m.PromptsByCategory),
  },

  { path: "**", redirectTo: "" }, // Redirect to home for any unknown routes
];
