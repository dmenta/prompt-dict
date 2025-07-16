import { Component } from "@angular/core";

@Component({
    selector: "pd-prompt-not-found",
    imports: [],
    template: "Lo que buscas no existe o ha sido eliminado.",
    host: {
        class: "text-center inline-block p-6 items-center justify-center text-balance text-not-found ",
    },
})
export class PromptNotFound {}
