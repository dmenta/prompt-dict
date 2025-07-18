import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import {
    CapitalizeDirective,
    TruncateDirective,
    HeaderLayoutDirective,
    HeaderContentDirective,
    HeaderRowDirective,
} from "../..";
import { HeaderBackButton } from "./buttons/header-back-button";

@Component({
    selector: "pd-section-header, [pd-section-header]",
    imports: [
        CapitalizeDirective,
        TruncateDirective,
        HeaderContentDirective,
        HeaderRowDirective,
        HeaderBackButton,
    ],
    template: `
        <div pdHeaderContent>
            <div pdHeaderRow>
                <button pdHeaderBackButton (back)="onBack($event)"></button>

                <div class="overflow-hidden w-full flex flex-col">
                    <h1
                        pdCapitalize
                        pdTruncate
                        class="text-header-contrast text-xl"
                        [title]="titulo()">
                        {{ titulo() }}
                    </h1>
                    <div
                        pdCapitalize
                        pdTruncate
                        class="text-header-low-contrast text-sm"
                        [title]="subtitulo()">
                        {{ subtitulo() }}
                    </div>
                </div>
            </div>
        </div>
    `,
    hostDirectives: [
        {
            directive: HeaderLayoutDirective,
        },
    ],
})
export class SectionHeader {
    router = inject(Router);
    titulo = input<string>("");
    subtitulo = input<string>("");

    onBack(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }
}
