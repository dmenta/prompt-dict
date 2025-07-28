import { Component, inject } from "@angular/core";
import { PromptsList } from "../../features";
import { Drawer, MainHeader, AppDataService } from "../../core";
import { NavMenu } from "../../features";

@Component({
    selector: "pd-home",
    imports: [PromptsList, MainHeader, Drawer, NavMenu],
    template: `
        <header pd-main-header (open)="drawer.show()"></header>
        <div pd-drawer class="w-fit  select-none " #drawer>
            <pd-nav-menu></pd-nav-menu>
        </div>
        @if (persistService.prompts().length > 0) {
        <div class="flex flex-row  md:ml-72">
            <ul pd-prompts-list class="px-6 py-6" [prompts]="persistService.prompts()"></ul>
        </div>
        } @else {
        <div class="flex flex-col  md:ml-72 items-center justify-center h-[80svh]">
            <span class="relative inline-flex mb-2">
                <span class="flex size-5"
                    ><span
                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span
                    ><span class="relative inline-flex size-5 rounded-full bg-primary-light"></span
                ></span>
            </span>
            <span class="opacity-95">cargando</span>
            <span class="opacity-95">prompts</span>
        </div>
        }
    `,
    host: {
        class: " w-full ",
    },
})
export class Home {
    persistService = inject(AppDataService);
}
