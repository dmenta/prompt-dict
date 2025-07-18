import { Component, inject } from "@angular/core";
import { DarkModeService } from "../../services/dark-mode.service";
import { IconDirective } from "../../directives/icon.directive";
import { HeaderButton } from "../header/buttons/header-button";

@Component({
    selector: "pd-mode-toggle",
    imports: [IconDirective, HeaderButton],
    template: ` <button pdHeaderButton (click)="modeService.toggle()">
        @if(modeService.darkMode()=== true) {
        <span pdIcon="light-mode"></span>
        }@else{
        <span pdIcon="dark-mode"></span>
        }
    </button>`,
    styles: ``,
})
export class ModeToggle {
    modeService = inject(DarkModeService);
}
