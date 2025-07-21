import { Component, signal } from "@angular/core";
import { TaskHeader } from "../../core/components/header/task-header";
import { CreatePromptFormComponent } from "../../features/prompts/create-prompt-form/create-prompt-form.component";

@Component({
    selector: "pd-create-prompt-page",
    imports: [TaskHeader, CreatePromptFormComponent],
    template: `<pd-task-header
            titulo="Nuevo Prompt"
            [enabled]="enabled()"
            [waiting]="this.submitting()"
            (apply)="form.submit()"></pd-task-header>
        <pd-create-prompt-form
            (valid)="this.enabled.set($event)"
            (submiting)="this.submitting.set($event)"
            #form></pd-create-prompt-form>`,
})
export class CreatePromptPage {
    enabled = signal<boolean>(false);
    submitting = signal<boolean>(false);
}
