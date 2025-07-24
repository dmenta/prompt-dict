import { Component, signal } from "@angular/core";
import { TaskHeader } from "../../core";
import { CreatePromptFormComponent } from "../../features";

@Component({
    selector: "pd-create-prompt-page",
    imports: [TaskHeader, CreatePromptFormComponent],
    template: `<pd-task-header
            titulo="Nuevo Prompt"
            [enabled]="enabled()"
            [waiting]="this.submitting()"
            (apply)="form.onSubmit($event)"></pd-task-header>
        <pd-create-prompt-form
            (valid)="this.enabled.set($event)"
            (submiting)="this.submitting.set($event)"
            #form></pd-create-prompt-form>`,
})
export class CreatePromptPage {
    enabled = signal<boolean>(false);
    submitting = signal<boolean>(false);
}
