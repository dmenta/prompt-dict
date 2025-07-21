import { Directive, output } from "@angular/core";
import { SimpleButton } from "./simple-button";

@Directive({
    selector: "button[pd-action-button]",
    host: {
        class: `shadow-md/80 rounded-full shadow-black/60  text-action-contrast bg-action`,
        "(click)": "onClick($event)",
    },
    hostDirectives: [{ directive: SimpleButton }],
})
export class ActionButton {
    clicked = output<MouseEvent | TouchEvent>();

    onClick(event: MouseEvent) {
        this.clicked.emit(event);
    }
}
