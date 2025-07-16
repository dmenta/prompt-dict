import { Component, input } from "@angular/core";
import { ValueItem } from "./value-item";
import { LabelItem } from "./label-item";

@Component({
    selector: "[pd-key-value-item] ",
    imports: [LabelItem, ValueItem],
    template: `
        <div [pd-label-item]="label()"></div>
        <div [pd-value-item]="value()"></div>
    `,
    host: { class: "flex flex-col  pt-1 pb-3 items-start justify-center" },
})
export class LabelValueItem {
    label = input<string>("");
    value = input<string | number | boolean | Date | undefined | string[] | null>(undefined);
}
