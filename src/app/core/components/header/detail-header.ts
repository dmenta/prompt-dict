import { Component, input, output } from "@angular/core";
import { Header } from "./header";
import { Params, Router } from "@angular/router";
import { HeaderButton } from "../../header-button";
import { StickyHeader } from "./sticky-header";

@Component({
    selector: "pd-detail-header, [pd-detail-header]",
    imports: [Header, HeaderButton],
    template: `<pd-header [double]="true" (mainButtonClicked)="onMainButtonClick($event)">
        <svg nav-button height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        <ng-content trailing-items>
            <button
                pdHeaderButton
                title="Copiar el prompt"
                aria-label="Copiar el prompt"
                (click)="onCopyPrompt($event)">
                <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path
                        d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                </svg>
            </button>
            <button pdHeaderButton>
                <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path
                        d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
                </svg>
            </button>
        </ng-content>
        <ng-content second-row>
            <h1
                class="text-header-contrast w-full inline-block truncate lowercase first-letter:uppercase text-[1.75rem]/9"
                [title]="titulo()">
                {{ titulo() }}
            </h1>
            <div
                class="text-header-low-contrast truncate lowercase first-letter:uppercase text-sm"
                title="Información detallada del elemento">
                Información detallada del elemento
            </div>
        </ng-content>
    </pd-header> `,
    hostDirectives: [StickyHeader],
})
export class DetailHeader {
    lastUrl: string;
    lastParams: Params;

    titulo = input<string>("Elemento");

    copyPrompt = output<MouseEvent>();

    constructor(private router: Router) {
        const lastUrl = this.router.parseUrl(this.router.lastSuccessfulNavigation?.initialUrl?.toString() || "/");
        this.lastParams = lastUrl.queryParams;

        this.lastUrl = lastUrl.toString().split("?")[0] || "/";
    }

    onCopyPrompt(event: MouseEvent) {
        this.copyPrompt.emit(event);
    }

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate([this.lastUrl], { queryParams: this.lastParams });
    }
}
