import { Directive } from "@angular/core";

@Directive({
    selector: "button[pd-button]",
    host: {
        class: `h-10 min-w-10 flex items-center justify-center active:scale-95 transition-all duration-150`,
    },
})
export class SimpleButton {}
