import { Directive, output } from "@angular/core";

@Directive({
    selector: "button[pd-action-button]",
    host: {
        class: `shadow-md/80 rounded-full shadow-black/60  text-action-contrast bg-action active:scale-95 transition-transform duration-100 w-10 h-10 flex items-center  justify-center `,
        "(click)": "onClick($event)",
    },
})
export class ActionButton {
    clicked = output<MouseEvent | TouchEvent>();

    onClick(event: MouseEvent) {
        this.clicked.emit(event);
    }
}
