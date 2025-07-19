import { Component, inject } from "@angular/core";
import { DarkModeService } from "../../services";
import { IconDirective } from "../../directives";
import { HeaderButton } from "../header/buttons/header-button";

@Component({
    selector: "pd-mode-toggle",
    imports: [IconDirective, HeaderButton],
    template: `
        <button
            pdHeaderButton
            (click)="modeService.toggle()"
            [pdIcon]="modeService.darkMode() ? 'dark-mode' : 'light-mode'"></button>
    `,
    styles: ``,
})
export class ModeToggle {
    modeService = inject(DarkModeService);
}
