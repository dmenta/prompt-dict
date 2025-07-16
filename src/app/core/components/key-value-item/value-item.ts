import { Component, input } from "@angular/core";

@Component({
    selector: "[pd-value-item] ",
    imports: [],
    template: `{{ value() }} `,
    host: { class: "text-md text-inverse" },
})
export class ValueItem {
    value = input<string | number | boolean | Date | undefined | string[]>(undefined, { alias: "pd-value-item" });
}
