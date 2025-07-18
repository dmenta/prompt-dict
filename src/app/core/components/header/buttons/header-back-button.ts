import { Component, output } from "@angular/core";
import { IconDirective } from "../../..";
import { HeaderButton } from "./header-button";

@Component({
    selector: "button[pdHeaderBackButton]",
    imports: [IconDirective],
    template: ` <span pdIcon="back"></span>`,
    hostDirectives: [
        {
            directive: HeaderButton,
        },
    ],
    host: {
        title: "Volver",
        "aria-label": "Volver",
        "(click)": "onClick($event)",
    },
})
export class HeaderBackButton {
    back = output<MouseEvent>();
    onClick(event: MouseEvent) {
        this.back.emit(event);
    }
}
