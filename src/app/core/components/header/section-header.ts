import { Component, inject, input, output } from "@angular/core";
import { Router } from "@angular/router";
import { HeaderBackButton } from "./buttons/header-back-button";
import {
    HeaderContentDirective,
    HeaderLayoutDirective,
    HeaderRowDirective,
} from "./header-layout.directive";
import { IconDirective, TruncateDirective } from "../../directives";
import { HeaderButton } from "./buttons/header-button";

@Component({
    selector: "pd-section-header, [pd-section-header]",
    imports: [
        HeaderButton,
        HeaderBackButton,
        HeaderContentDirective,
        HeaderRowDirective,
        TruncateDirective,
        IconDirective,
    ],
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
            <button
                pdHeaderButton
                [disabled]="!enabled()"
                title="Eliminar"
                aria-label="Eliminar"
                (click)="onDelete($event)"
                class="ml-4 disabled:pointer-events-none disabled:opacity-50">
                <span pdIcon="delete"></span>
            </button>
        </div>
    </div>`,
    hostDirectives: [
        {
            directive: HeaderLayoutDirective,
        },
    ],
})
export class SectionHeader {
    enabled = input<boolean>(false);
    erase = output<MouseEvent>();
    router = inject(Router);
    titulo = input<string>("");
    subtitulo = input<string>("");

    onBack(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }

    onDelete(event: MouseEvent) {
        this.erase.emit(event);
    }
}
