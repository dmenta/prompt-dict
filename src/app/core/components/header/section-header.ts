import { Component, input } from "@angular/core";
import { Router } from "@angular/router";
import { Header } from "./header";
import { StickyHeader } from "./sticky-header";

@Component({
    selector: "pd-section-header , [pd-section-header]",
    imports: [Header],
    template: `<pd-header (mainButtonClicked)="onMainButtonClick($event)">
        <svg nav-button height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        <ng-content>
            <h1
                class="text-header-contrast w-full inline-block truncate lowercase first-letter:uppercase text-xl"
                [title]="titulo()">
                {{ titulo() }}
            </h1>
            <div
                class="text-header-low-contrast truncate lowercase first-letter:uppercase text-sm"
                [title]="subtitulo()">
                {{ subtitulo() }}
            </div>
        </ng-content>
    </pd-header>`,
    hostDirectives: [StickyHeader],
})
export class SectionHeader {
    titulo = input<string>("");
    subtitulo = input<string>("");

    constructor(private router: Router) {}

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }
}
