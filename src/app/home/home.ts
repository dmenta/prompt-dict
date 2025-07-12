import { Component, model, signal } from "@angular/core";
import { TagsList } from "../core/tags-list/tags-list";
import { PromptsList } from "../core/prompts-list/prompts-list";
import { Drawer } from "../core/drawer/drawer";

@Component({
  selector: "pd-home",
  imports: [TagsList, PromptsList, Drawer],
  template: `
    <div class=" p-0 m-0 overflow-hidden w-screen h-screen ">
      <div
        class="sticky top-0  right-0 left-0  h-12   bg-pink-600  flex items-center
           justify-start px-2 gap-4  text-pink-100 text-lg shadow-md/30 dark:shadow-black/30">
        <button
          (click)="isOpen.set(!isOpen())"
          class="h-10 w-10 flex items-center justify-center rounded-md hover:bg-pink-500  transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
        <h1>Prompt Dictionary</h1>
      </div>
      <div class="h-screen overflow-hidden flex flex-row ">
        <pd-drawer class="w-fit" [(isOpen)]="isOpen">
          <div drawer-title>Tags</div>
          <pd-tags-list drawer-content></pd-tags-list>
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
