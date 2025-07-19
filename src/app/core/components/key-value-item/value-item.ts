import { Component, computed, input } from "@angular/core";
import { formatRelativeTime } from "../../utils/date-operation";

@Component({
    selector: "[pd-value-item] ",
    imports: [],
    template: `{{ valueText() }} `,
    host: { class: "text-md text-inverse" },
})
export class ValueItem {
    value = input<string | number | boolean | Date | undefined | string[] | null>(undefined, {
        alias: "pd-value-item",
    });

    valueText = computed(() => {
        const value = this.value();
        if (value === undefined || value === null) {
            return "Sin información";
        }
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(", ") : "Sin información";
        }
        if (typeof this.value() === "boolean") {
            return this.value() ? "Sí" : "No";
        }
        if (value instanceof Date) {
            return formatRelativeTime(value);
        }
        return String(this.value());
    });
}
