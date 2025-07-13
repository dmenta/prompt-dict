import { Component, model } from "@angular/core";
import { Drawer } from "../../core/components/drawer/drawer";
import { Header } from "../../core/components/header/header";
import { CategoriesList } from "../../features/categories/categories-list/categories-list";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";

@Component({
  selector: "pd-home",
  imports: [CategoriesList, PromptsList, Drawer, Header],
  template: `
    <div class=" p-0 m-0 overflow-hidden w-screen h-screen ">
      <pd-header class="z-10" (toggleDrawer)="isOpen.set(!isOpen())">Prompter</pd-header>
      <div class="h-[calc(100svh_-_3rem)] overflow-hidden flex flex-row ">
        <pd-drawer class="w-fit" [(isOpen)]="isOpen">
          <div drawer-title>Tags</div>
          <pd-categories-list></pd-categories-list>
        </pd-drawer>
        <pd-prompts-list></pd-prompts-list>
      </div>
    </div>
  `,
  styles: ``,
})
export class Home {
  isOpen = model(false);
}
