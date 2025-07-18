import { Directive } from "@angular/core";

/**
 * Directiva para elementos truncables
 */
@Directive({
    selector: "[pdTruncate]",
    host: {
        class: "w-full inline-block truncate",
    },
})
export class TruncateDirective {}
