import { Component, input } from "@angular/core";
import { ActivableChip } from "../activable-chip";

@Component({
    selector: "pd-chips-list",
    imports: [ActivableChip],
    template: ` <ul class="flex flex-row gap-3 overflow-x-auto pt-1 pb-6">
        @for (item of items(); track item.id) {
        <li [pdActivableChip]="item.activa">
            {{ item.name }}
        </li>
        }
    </ul>`,
    styles: ``,
})
export class ChipsList {
    items = input<{ id: string; name: string; activa: boolean }[]>([]);
}
