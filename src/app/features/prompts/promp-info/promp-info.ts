import { Component, input } from "@angular/core";
import { Prompt } from "../prompt";
import { RelativeDatePipe } from "../../../core/directives/relative-date";

@Component({
    selector: "pd-promp-info",
    imports: [RelativeDatePipe],
    template: `{{ prompt().fecha_creacion | relDate }}, {{ prompt().autor }}`,
    host: {
        class: "md:flex justify-end items-center text-inverse-low hidden",
    },
})
export class PrompInfo {
    prompt = input<{ autor: string; fecha_creacion: Date }>({} as Prompt);
}
