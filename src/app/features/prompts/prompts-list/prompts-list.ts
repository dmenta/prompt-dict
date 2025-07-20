import { Component, input } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { FirestorePrompt } from "../../../core/models";

@Component({
    selector: "pd-prompts-list, [pd-prompts-list]",
    imports: [DisplayPrompt],
    template: `
        @for(item of prompts(); track item.id) { @defer (on viewport) {
        <li pd-display-prompt [attr.tabindex]="1" [prompt]="item"></li>
        } @placeholder {
        <li
            class="h-48 select-none md:min-w-[16rem] md:w-[24rem] md:max-w-[36rem] grow-1  relative inline-block group px-2  py-4  shadow-md/30 shadow-black/40 dark:shadow-black/80  bg-card hover:bg-card-hover  dark:hover:bg-card-hover/30 transition-colors duration-150"></li>
        } }
    `,
    host: {
        class: "flex flex-col md:flex-row flex-wrap h-full w-full  gap-6",
    },
})
export class PromptsList {
    prompts = input<FirestorePrompt[]>([]);
}
