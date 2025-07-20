import { Component, input } from "@angular/core";
import { RelativeDatePipe } from "../../../core";
import { FirestorePrompt } from "../../../core/models";

@Component({
    selector: "pd-promp-info",
    imports: [RelativeDatePipe],
    template: `{{ prompt().fecha_creacion | relDate }}, {{ prompt().autor }}`,
    host: {
        class: "md:flex justify-end items-center text-inverse-low hidden",
    },
})
export class PromptInfo {
    prompt = input<{ autor: string; fecha_creacion: Date }>({} as FirestorePrompt);
}
