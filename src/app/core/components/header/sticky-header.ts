import { Directive } from "@angular/core";

@Directive({
    selector: "[pdStickyHeader]",
    host: {
        class: "sticky left-0 top-0   z-10 bg-header ",
    },
})
export class StickyHeader {
    constructor() {}
}
