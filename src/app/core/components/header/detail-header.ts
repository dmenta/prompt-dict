import { Component, input, output } from "@angular/core";
import { Params, Router, RouterLink } from "@angular/router";
import { HeaderButton } from "./buttons/header-button";
import { IconDirective, TruncateDirective } from "../../directives";
import { HeaderBackButton } from "./buttons/header-back-button";
import {
    DoubleHeaderLayoutDirective,
    HeaderContentDirective,
    HeaderRowDirective,
} from "./header-layout.directive";
import { HeaderActionButton } from "./buttons/header-action-button";

@Component({
    selector: "pd-detail-header, [pd-detail-header]",
    imports: [
        IconDirective,
        HeaderButton,
        HeaderBackButton,
        HeaderContentDirective,
        HeaderRowDirective,
        TruncateDirective,
        HeaderActionButton,
        RouterLink,
    ],
    template: ` <div pdHeaderContent>
        <div pdHeaderRow class="-mb-2">
            <button pdHeaderBackButton (back)="onBack($event)"></button>
            <div class="w-full"></div>
            <div class="flex items-center ">
                <button
                    pdHeaderButton
                    title="Copiar el prompt"
                    aria-label="Copiar el prompt"
                    (click)="onCopyPrompt($event)">
                    <span pdIcon="copy"></span>
                </button>
                <button
                    pdHeaderButton
                    title="Compartir el prompt"
                    aria-label="Compartir el prompt"
                    (click)="onShare($event)">
                    <span pdIcon="share"></span>
                </button>
                <button
                    [routerLink]="['/prompts/create']"
                    pdHeaderActionButton
                    title="Agregar"
                    aria-label="Agregar"
                    class="ml-4"
                    pdIcon="check"></button>
            </div>
        </div>
        <div class="overflow-hidden w-full px-3">
            <h1 pdTruncate class="text-header-contrast text-[1.75rem]/9" [title]="titulo()">
                {{ titulo() }}
            </h1>
            <div pdTruncate class="text-header-low-contrast text-sm" [title]="subtitulo()">
                {{ subtitulo() }}
            </div>
        </div>
    </div>`,
    hostDirectives: [
        {
            directive: DoubleHeaderLayoutDirective,
        },
    ],
})
export class DetailHeader {
    lastUrl: string;
    lastParams: Params;

    titulo = input<string>("Elemento");
    subtitulo = input<string>("Información detallada del elemento");
    copyPrompt = output<MouseEvent>();
    share = output<MouseEvent>();

    constructor(private router: Router) {
        const lastUrl = this.router.parseUrl(
            this.router.lastSuccessfulNavigation?.initialUrl?.toString() || "/"
        );
        this.lastParams = lastUrl.queryParams;

        this.lastUrl = lastUrl.toString().split("?")[0] || "/";
    }

    onCopyPrompt(event: MouseEvent) {
        this.copyPrompt.emit(event);
    }

    onBack(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate([this.lastUrl], { queryParams: this.lastParams });
    }

    onShare(event: MouseEvent) {
        this.share.emit(event);
    }
}
