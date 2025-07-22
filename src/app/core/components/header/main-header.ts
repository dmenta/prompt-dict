import { Component, output, inject } from "@angular/core";
import { ModeToggle } from "../mode-toggle/mode-toggle";
import { PlaceholderSearcher } from "../searcher/placeholder-searcher";
import { HeaderButton } from "./buttons/header-button";
import { IconDirective } from "../../directives";
import {
    HeaderContentDirective,
    HeaderLayoutDirective,
    HeaderRowDirective,
} from "./header-layout.directive";
import { AuthService } from "../../services/auth.service";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "pd-main-header, [pd-main-header]",
    imports: [
        PlaceholderSearcher,
        ModeToggle,
        IconDirective,
        HeaderContentDirective,
        HeaderRowDirective,
        HeaderButton,
        AsyncPipe,
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
                class="text-2xl/8 hidden md:inline-flex items-center gap-0.5 text-contrast font-mont-alt font-semibold"
                style="letter-spacing: 0.07em;">
                <span pdIcon="terminal" class="scale-[115%] text-lime-300"></span>
                ARTIFICIALMENTE
            </div>
            <pd-placeholder-searcher class="w-full max-w-[500px]"></pd-placeholder-searcher>
            <div class="flex items-center gap-2">
                @if(currentUser$ | async; as user){
                <span class="text-contrast"> {{ user.email }}</span>
                <button
                    pdHeaderButton
                    (click)="logout()"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión"
                    pdIcon="logout"></button>
                }@else {
                <button
                    pdHeaderButton
                    (click)="login()"
                    title="Iniciar sesión"
                    aria-label="Iniciar sesión"
                    pdIcon="login"></button>
                }
                <pd-mode-toggle></pd-mode-toggle>
            </div>
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
    authService = inject(AuthService);
    currentUser$ = this.authService.currentUser$;

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.open.emit();
    }

    login() {
        this.authService.loginWithGoogle();
    }

    logout() {
        this.authService.logout();
    }
}
