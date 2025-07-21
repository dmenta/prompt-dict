import { Directive } from "@angular/core";
import { SimpleButton } from "../../../directives";

@Directive({
    selector: "button[pdHeaderActionButton]",
    host: {
        class: "hover:shadow-md  hover:shadow-black/20 shadow-black/40 rounded-full bg-action hover:bg-action-hover  text-header-contrast",
    },
    hostDirectives: [{ directive: SimpleButton }],
})
export class HeaderActionButton {}
