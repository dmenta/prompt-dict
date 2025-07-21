import { Directive } from "@angular/core";

@Directive({
    selector: "button[pdHeaderActionButton]",
    host: {
        class: "hover:shadow-md active:scale-95 hover:shadow-black/20 shadow-black/40 h-10 min-w-10 flex items-center justify-center rounded-full bg-action hover:bg-action-hover transition-colors text-header-contrast",
    },
})
export class HeaderActionButton {}
