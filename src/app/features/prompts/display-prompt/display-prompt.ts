import { Component, inject, input, signal } from "@angular/core";
import { Prompt } from "../prompt";
import { CopyActions } from "../../../core";
import { Router, RouterLink } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";

@Component({
    selector: "pd-display-prompt, [pd-display-prompt]",
    imports: [CopyActions, RouterLink],

    template: `
        @if(prompt(); as promptOk) {
        <a [routerLink]="['/', promptUrl, promptOk.slug]">
            <div
                class="text-primary-dark  px-4 text-xl font-semibold uppercase opacity-85 group-hover:opacity-100"
                style="text-wrap: balance">
                {{ promptOk.titulo }}
            </div>
        </a>
        <div
            class="relative prompt w-full opacity-85 group-hover:opacity-100 text-prompt
      transition-opacity duration-150 px-4 ">
            <div class="prompt-text font-merri font-[370] py-6 text-lg/8 italic">
                {{ promptOk.prompt }}
            </div>
            <div>{{ promptOk.descripcion }}</div>
            <pd-copy-actions
                class="absolute bottom-3 right-5 pointer-events-none  transition-discrete opacity-0 hidden z-3 group-active:block group-hover:block group-focus:block group-focus:opacity-100   group-hover:opacity-80
      hover:opacity-100 transition-all group-focus:pointer-events-auto group-hover:pointer-events-auto"
                tabindex="2"
                [promptText]="promptOk.prompt"
                [promptUrl]="this.baseUrl() + promptOk.slug"></pd-copy-actions>
        </div>
        } @else{
        <div class="no-prompt">No prompt available</div>
        }
    `,
    host: {
        class: "select-none relative inline-block group px-2  py-4  shadow-md/50 shadow-black/60 dark:shadow-black/50  bg-card hover:bg-card-hover  dark:hover:bg-card-hover/30 transition-colors duration-150",
    },
})
export class DisplayPrompt {
    promptUrl = "prompt";
    basePath = inject(APP_BASE_HREF);
    baseUrl = signal(window.location.origin + this.basePath + this.promptUrl + "/");

    visible = signal(false);
    prompt = input<Prompt | null>(null);
}
