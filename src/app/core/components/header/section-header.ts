import { Component, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { HeaderBackButton } from "./buttons/header-back-button";
import {
    HeaderContentDirective,
    HeaderLayoutDirective,
    HeaderRowDirective,
} from "./header-layout.directive";
import { TruncateDirective } from "../../directives";

@Component({
    selector: "pd-section-header, [pd-section-header]",
    imports: [HeaderBackButton, HeaderContentDirective, HeaderRowDirective, TruncateDirective],
    template: `<div pdHeaderContent>
        <div pdHeaderRow>
            <button pdHeaderBackButton (back)="onBack($event)"></button>
            <div class="overflow-hidden w-full flex flex-col">
                <h1 pdTruncate class="text-header-contrast text-xl" [title]="titulo()">
                    {{ titulo() }}
                </h1>
                <div class="text-header-low-contrast text-sm" [title]="subtitulo()">
                    {{ subtitulo() }}
                </div>
            </div>
        </div>
    </div>`,
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
