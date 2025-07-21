import { Directive } from "@angular/core";
import { SimpleButton } from "../../../directives";

@Directive({
    selector: "button[pdHeaderButton]",
    host: {
        class: "rounded-md hover:bg-button-hover  text-header-contrast",
    },
    hostDirectives: [{ directive: SimpleButton }],
})
export class HeaderButton {}
