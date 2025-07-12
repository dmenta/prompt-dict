import { Component, model } from "@angular/core";
import { PromptsList } from "../core/prompts-list/prompts-list";
import { Drawer } from "../core/drawer/drawer";
import { Header } from "../core/header/header";
import { CategoriesList } from "../core/categories-list/categories-list";

@Component({
  selector: "pd-home",
  imports: [CategoriesList, PromptsList, Drawer, Header],
  template: `
    <div class=" p-0 m-0 overflow-hidden w-screen h-screen ">
      <pd-header class="z-10" (toggleDrawer)="isOpen.set(!isOpen())">Prompter</pd-header>
      <div class="h-[calc(100svh_-_3rem)] overflow-hidden flex flex-row ">
        <pd-drawer class="w-fit" [(isOpen)]="isOpen">
          <div drawer-title>Tags</div>
          <pd-categories-list drawer-content></pd-categories-list>
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
