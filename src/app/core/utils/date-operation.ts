const rtfes = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function formatRelativeTime(value: Date): string {
    const now = new Date();
    const diffTime = value.getTime() - now.getTime();
    const unit = determineUnit(diffTime);
    return rtfes.format(toUnit(diffTime, unit), unit);
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
