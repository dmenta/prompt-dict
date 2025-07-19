import { Component, output } from "@angular/core";
import { ModeToggle } from "../mode-toggle/mode-toggle";
import { PlaceholderSearcher } from "../searcher/placeholder-searcher";
import { HeaderButton } from "./buttons/header-button";
import { IconDirective } from "../../directives";
import {
    HeaderContentDirective,
    HeaderLayoutDirective,
    HeaderRowDirective,
} from "./header-layout.directive";

@Component({
    selector: "pd-main-header, [pd-main-header]",
    imports: [
        PlaceholderSearcher,
        ModeToggle,
        IconDirective,
        HeaderContentDirective,
        HeaderRowDirective,
        HeaderButton,
    ],
    template: ` <div pdHeaderContent>
        <div pdHeaderRow>
            <button
                pdHeaderButton
                title="Abrir menú"
                aria-label="Abrir menú"
                (click)="onMainButtonClick($event)"
                class="md:hidden "
                pdIcon="menu"></button>
            <div
                class="text-2xl hidden md:inline-block font-mont-alt font-semibold"
                style="letter-spacing: 0.07em;">
                ARTIFICIALMENTE
            </div>
            <pd-placeholder-searcher class="w-full max-w-[500px]"></pd-placeholder-searcher>
            <pd-mode-toggle></pd-mode-toggle>
        </div>
    </div>`,
    hostDirectives: [
        {
            directive: HeaderLayoutDirective,
        },
    ],
})
export class MainHeader {
    open = output<void>();

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.open.emit();
    }
}
