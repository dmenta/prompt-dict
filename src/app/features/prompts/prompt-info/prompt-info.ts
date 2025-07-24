import { Component, input } from "@angular/core";
import { RelativeDatePipe } from "../../../core";
import { Prompt } from "../../../core";
import { Timestamp } from "firebase/firestore";

@Component({
    selector: "pd-promp-info",
    imports: [RelativeDatePipe],
    template: `{{ prompt().fecha_creacion.toDate() | relDate }}, {{ prompt().autor }}`,
    host: {
        class: "md:flex justify-end items-center text-inverse-low hidden",
    },
})
export class PromptInfo {
    prompt = input<{ autor: string; fecha_creacion: Timestamp }>({} as Prompt);
}
