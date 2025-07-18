import { Directive } from "@angular/core";

/**
 * Directiva para elementos clickeables que requieren stop propagation
 */
@Directive({
    selector: "[pdClickable]",
    host: {
        "(click)": "$event.stopPropagation()",
    },
})
export class ClickableDirective {}

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

/**
 * Directiva para botones de acción que incluyen efectos de hover y transiciones
 */
@Directive({
    selector: "[pdActionButton]",
    host: {
        class: "inline-flex items-center justify-center rounded-md hover:bg-button-hover transition-colors focus-visible:outline-none focus-visible:ring-2",
    },
})
export class ActionButtonDirective {}
