import { Component, inject, input, signal } from "@angular/core";
import { CopyActions } from "../../../core";
import { RouterLink } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { PromptInfo } from "../promp-info/promp-info";
import { FirestorePrompt } from "../../../core/models";

@Component({
    selector: "pd-display-prompt, [pd-display-prompt]",
    imports: [CopyActions, RouterLink, PromptInfo],

    template: `
        @if(prompt(); as promptOk) {
        <pd-promp-info [prompt]="promptOk" class="pb-4 px-2 text-xs"></pd-promp-info>
        <a [routerLink]="['/', promptUrl, promptOk.slug]">
            <div
                class="text-primary-dark  px-2 text-lg/6 font-semibold uppercase opacity-85 group-hover:opacity-100"
                style="text-wrap: balance">
                {{ promptOk.titulo }}
            </div>
        </a>
        <div
            class="relative prompt  opacity-85 group-hover:opacity-100 text-prompt
            transition-opacity duration-150 px-2">
            <div class="prompt-text font-merri font-[370] py-3 leading-7 italic">
                {{ promptOk.prompt }}
            </div>
            <div class="text-sm">{{ promptOk.descripcion }}</div>
        </div>
        <pd-copy-actions
            class="absolute bottom-3 right-5 pointer-events-none  transition-discrete opacity-0 hidden z-3 group-active:block group-hover:block group-focus:block group-focus:opacity-100   group-hover:opacity-80
      hover:opacity-100 transition-all group-focus:pointer-events-auto group-hover:pointer-events-auto"
            tabindex="2"
            [promptText]="promptOk.prompt"
            [promptUrl]="this.baseUrl() + promptOk.slug"></pd-copy-actions>
        } @else{
        <div class="no-prompt">No prompt available</div>
        }
    `,
    host: {
        class: "select-none md:min-w-[16rem] md:w-[24rem] md:max-w-[36rem] grow-1  relative inline-block group px-2  py-4  shadow-md/30 shadow-black/40 dark:shadow-black/80  bg-card hover:bg-card-hover  dark:hover:bg-card-hover/30 transition-colors duration-150",
    },
})
export class DisplayPrompt {
    promptUrl = "prompt";
    basePath = inject(APP_BASE_HREF);
    baseUrl = signal(window.location.origin + this.basePath + this.promptUrl + "/");

    visible = signal(false);
    prompt = input<FirestorePrompt | null>(null);
}
