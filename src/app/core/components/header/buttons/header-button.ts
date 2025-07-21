import { Directive } from "@angular/core";

@Directive({
    selector: "button[pdHeaderButton]",
    host: {
        class: "h-10 min-w-10 flex active:scale-95 items-center justify-center rounded-md hover:bg-button-hover transition-colors text-header-contrast",
    },
})
export class HeaderButton {}
