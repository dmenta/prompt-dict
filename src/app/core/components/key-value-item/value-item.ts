import { Component, computed, input } from "@angular/core";

@Component({
    selector: "[pd-value-item] ",
    imports: [],
    template: `{{ valueText() }} `,
    host: { class: "text-md text-inverse" },
})
export class ValueItem {
    value = input<string | number | boolean | Date | undefined | string[]>(undefined, { alias: "pd-value-item" });

    private rtfes = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
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
            const now = new Date();
            const diffTime = value.getTime() - now.getTime();
            const unit = determineUnit(diffTime);
            return this.rtfes.format(toUnit(diffTime, unit), unit);
        }
        return String(this.value());
    });
}

// Set of constants that represent how many ms per unit
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
// yeah, this is probably not perfect
const MONTH = 4 * WEEK;
const YEAR = MONTH * 12;

function determineUnit(x: number) {
    x = Math.abs(x);
    if (x < MINUTE) return "second";
    if (x < HOUR) return "minute";
    if (x < DAY) return "hour";
    if (x < WEEK) return "day";
    if (x < MONTH) return "week";
    if (x < YEAR) return "month";
    return "year";
}

function toUnit(x: number, unit: "second" | "minute" | "hour" | "day" | "week" | "month" | "year") {
    if (unit === "minute") return Math.round(x / MINUTE);
    if (unit === "hour") return Math.round(x / HOUR);
    if (unit === "day") return Math.round(x / DAY);
    if (unit === "week") return Math.round(x / WEEK);
    if (unit === "month") return Math.round(x / MONTH);
    if (unit === "year") return Math.round(x / YEAR);
    return Math.round(x / 1000); // seconds
}
