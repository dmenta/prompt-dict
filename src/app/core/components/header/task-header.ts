import { Component, inject, input, output } from "@angular/core";
import {
    HeaderContentDirective,
    HeaderLayoutDirective,
    HeaderRowDirective,
} from "./header-layout.directive";
import { HeaderBackButton } from "./buttons/header-back-button";
import { IconDirective, TruncateDirective } from "../../directives";
import { Router } from "@angular/router";
import { HeaderActionButton } from "./buttons/header-action-button";

@Component({
    selector: "pd-task-header",
    imports: [
        HeaderBackButton,
        HeaderActionButton,
        HeaderContentDirective,
        HeaderRowDirective,
        IconDirective,
        TruncateDirective,
    ],
    template: `<div pdHeaderContent>
        <div pdHeaderRow class="">
            <button pdHeaderBackButton (back)="onBack($event)"></button>
            <h1 pdTruncate class="text-header-contrast text-2xl" [title]="titulo()">
                {{ titulo() }}
            </h1>
            <div [class.spinner-show]="waiting()" class="spinner"></div>
            <button
                pdHeaderActionButton
                title="Aceptar"
                aria-label="Aceptar"
                [disabled]="!enabled() || waiting()"
                (click)="onTaskButtonClicked($event)"
                class="mr-2 disabled:pointer-events-none md:hidden disabled:bg-neutral-500 dark:disabled:bg-neutral-600 transition-colors duration-300"
                pdIcon="check"></button>
        </div>
    </div>`,
    hostDirectives: [
        {
            directive: HeaderLayoutDirective,
        },
    ],
})
export class TaskHeader {
    apply = output<void>();
    waiting = input<boolean>(false);
    enabled = input<boolean>(true);
    router = inject(Router);
    titulo = input<string>("Tarea");

    onBack(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }

    onTaskButtonClicked(event: MouseEvent) {
        event.stopPropagation();
        this.apply.emit();
    }
}
