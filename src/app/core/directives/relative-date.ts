import { Pipe } from "@angular/core";
import { formatRelativeTime } from "../utils/date-operation";

@Pipe({
    name: "relDate",
    standalone: true,
})
export class RelativeDatePipe {
    transform(value: Date | string): string {
        if (!value) return "Sin información";

        formatRelativeTime(value instanceof Date ? value : new Date(value));

        return formatRelativeTime(new Date(value));
    }
}
