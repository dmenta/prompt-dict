import { Component, input } from "@angular/core";

@Component({
    selector: "[pd-label-item] ",
    imports: [],
    template: `{{ text() }} `,
    host: { class: "text-sm text-inverse opacity-80" },
})
export class LabelItem {
    text = input<string>("", { alias: "pd-label-item" });
}
