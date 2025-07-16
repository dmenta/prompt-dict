import { Component, input, output } from "@angular/core";
import { HeaderButton } from "../../header-button";

@Component({
    selector: "pd-header",
    imports: [HeaderButton],
    template: ` <div
        [class.h-14]="!double()"
        [class.h-30]="double()"
        class=" px-3 flex flex-col justify-center gap-1 bg-header ">
        <div
            class="flex  items-center overflow-hidden
           justify-between gap-2">
            <button pdHeaderButton class="text-header-contrast" (click)="onMainButtonClick($event)">
                <ng-content select="[nav-button]"></ng-content>
            </button>
            <div class="overflow-hidden w-full flex flex-col">
                <ng-content></ng-content>
            </div>
            <div class="text-header-low-contrast flex items-center gap-">
                <ng-content select="[trailing-items]"></ng-content>
            </div>
        </div>
        <div [class.hidden]="!double()" class="px-3 overflow-hidden flex flex-col gap-1 mb-1">
            <ng-content select="[second-row]"></ng-content>
        </div>
    </div>`,
})
export class Header {
    double = input<boolean>(false);
    mainButtonClicked = output<MouseEvent>();
    onMainButtonClick(event: MouseEvent) {
        this.mainButtonClicked.emit(event);
    }
}
