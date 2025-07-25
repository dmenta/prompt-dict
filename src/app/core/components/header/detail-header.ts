import { Component, inject, input, output } from "@angular/core";
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
import { DialogComponent } from "../dialog/confirm";
import { AdminService } from "../../services/admin.service";
import { AsyncPipe } from "@angular/common";

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
        DialogComponent,
        AsyncPipe,
    ],
    template: `
        <div pdHeaderContent>
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
                    @if(isAdmin$ | async) {
                    <button
                        pdHeaderButton
                        title="Eliminar el prompt"
                        aria-label="Eliminar el prompt"
                        (click)="confirmar.show()"
                        class="ml-4">
                        <span pdIcon="delete"></span>
                    </button>
                    <button
                        [routerLink]="['/prompts/create']"
                        pdHeaderActionButton
                        title="Agregar"
                        aria-label="Agregar"
                        class="ml-4 mr-2"
                        pdIcon="add"></button>
                    }
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
        </div>
        <pd-dialog #confirmar dialogTitle="Eliminar" (confirm)="onDelete($event)">
            Eliminará definitivamente el elemento, desea continuar?
        </pd-dialog>
    `,
    hostDirectives: [
        {
            directive: DoubleHeaderLayoutDirective,
        },
    ],
})
export class DetailHeader {
    private readonly adminService = inject(AdminService);
    public readonly isAdmin$ = this.adminService.isCurrentUserAdmin();
    private lastUrl: string;
    private lastParams: Params;
    private lastName: string;

    public readonly titulo = input<string>("Elemento");
    public readonly subtitulo = input<string>("Información detallada del elemento");
    public readonly copyPrompt = output<MouseEvent>();
    public readonly share = output<MouseEvent>();
    public readonly delete = output<MouseEvent>();

    constructor(private router: Router) {
        const lastUrl = this.router.parseUrl(
            this.router.lastSuccessfulNavigation?.initialUrl?.toString() || "/"
        );

        this.lastName = this.router.lastSuccessfulNavigation?.extras.state?.["name"] || "";

        this.lastParams = lastUrl.queryParams;

        this.lastUrl = lastUrl.toString().split("?")[0] || "/";
    }

    public onCopyPrompt(event: MouseEvent) {
        this.copyPrompt.emit(event);
    }

    public onBack(event: MouseEvent) {
        event.stopPropagation();
        if (this.lastName) {
            this.router.navigate([this.lastUrl], {
                queryParams: this.lastParams,
                state: { name: this.lastName },
            });
            return;
        } else {
            this.router.navigate([this.lastUrl], { queryParams: this.lastParams });
        }
    }

    public onShare(event: MouseEvent) {
        this.share.emit(event);
    }

    public onDelete(event: MouseEvent) {
        event.stopPropagation();
        this.delete.emit(event);
    }
}
