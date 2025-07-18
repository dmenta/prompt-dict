import { Component, inject, input } from "@angular/core";
import { ActionButton } from "../directives/action-button";
import { CopyService } from "../services";
import { IconDirective } from "../directives/icon.directive";

@Component({
    selector: "pd-copy-actions",
    imports: [ActionButton, IconDirective],
    template: `<div class="space-x-2 flex">
        <button
            pd-action-button
            title="Copiar la dirección"
            aria-label="Copiar la dirección"
            (clicked)="copyUrl()"
            pdIcon="link"></button>
        <button
            pd-action-button
            title="Copiar el prompt"
            aria-label="Copiar el prompt"
            (clicked)="copyPrompt()"
            pdIcon="copy"></button>
    </div>`,
})
export class CopyActions {
    copyService = inject(CopyService);

    promptText = input<string>("");
    promptUrl = input<string | null>(null);

    copyPrompt() {
        if (this.promptText()) {
            this.copyService.copy(this.promptText());
        }
    }
    copyUrl() {
        if (this.promptUrl()) {
            this.copyService.copy(this.promptUrl()!);
        }
    }
}
