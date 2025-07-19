import { Component, input } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";
import { Prompt } from "../prompt";

@Component({
    selector: "pd-prompts-list, [pd-prompts-list]",
    imports: [DisplayPrompt],
    template: `
        @for(item of prompts(); track item.id) {
        <li pd-display-prompt [attr.tabindex]="1" [prompt]="item"></li>
        } @empty {
        <li class="flex flex-col items-center justify-center h-full">
            <h1 class="text-lg font-semibold">No hay prompts</h1>
            <p class="text-not-found text-balance text-center">
                No se encontraron prompts para mostrar.
            </p>
        </li>
        }
    `,
    host: {
        class: "flex flex-col md:flex-row flex-wrap h-full w-full  gap-4",
    },
})
export class PromptsList {
    prompts = input<Prompt[]>([]);
}
