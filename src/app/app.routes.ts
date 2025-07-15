import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/prompts/prompts").then((m) => m.Prompts),
  },

  {
    path: "prompt/:id",
    loadComponent: () => import("./pages/prompt-detail/prompt-detail").then((m) => m.PromptDetail),
    pathMatch: "full",
  },

  {
    path: "prompts",
    redirectTo: "",
    pathMatch: "full",
  },

  { path: "**", redirectTo: "" }, // Redirect to home for any unknown routes
];
