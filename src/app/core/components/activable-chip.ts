import { Directive, input } from "@angular/core";

@Directive({
    selector: "[pdActivableChip]",
    host: {
        "[class.activa]": "activa()",
        class: "search-chip",
    },
})
export class ActivableChip {
    activa = input<boolean>(false, { alias: "pdActivableChip" });
}
