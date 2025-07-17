import { Component, input } from "@angular/core";
import { Router } from "@angular/router";
import { IconDirective, CapitalizeDirective, TruncateDirective, HeaderLayoutDirective } from "../../directives";

@Component({
    selector: "pd-section-header-improved, [pd-section-header-improved]",
    imports: [IconDirective, CapitalizeDirective, TruncateDirective],
    template: `
        <div class="px-3 flex flex-col justify-center gap-1">
            <div class="flex items-center overflow-hidden justify-between gap-2">
                <button
                    class="h-10 min-w-10 flex items-center justify-center rounded-md hover:bg-button-hover transition-colors text-header-contrast"
                    (click)="onMainButtonClick($event)">
                    <span pdIcon="back"></span>
                </button>

                <div class="overflow-hidden w-full flex flex-col">
                    <h1 pdCapitalize pdTruncate class="text-header-contrast text-xl" [title]="titulo()">
                        {{ titulo() }}
                    </h1>
                    <div pdCapitalize pdTruncate class="text-header-low-contrast text-sm" [title]="subtitulo()">
                        {{ subtitulo() }}
                    </div>
                </div>
            </div>
        </div>
    `,
    hostDirectives: [
        {
            directive: HeaderLayoutDirective,
            inputs: ["double: false"],
        },
    ],
})
export class SectionHeaderImproved {
    titulo = input<string>("");
    subtitulo = input<string>("");

    constructor(private router: Router) {}

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }
}
