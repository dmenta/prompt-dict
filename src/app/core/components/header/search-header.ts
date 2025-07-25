import { Component, inject, input, output } from "@angular/core";
import { Router } from "@angular/router";
import { Searcher } from "../searcher/searcher";
import { HeaderBackButton } from "./buttons/header-back-button";
import {
    HeaderContentDirective,
    HeaderLayoutDirective,
    HeaderRowDirective,
} from "./header-layout.directive";

@Component({
    selector: "pd-search-header , [pd-search-header]",
    imports: [HeaderContentDirective, HeaderRowDirective, Searcher, HeaderBackButton],
    template: `<div pdHeaderContent>
        <div pdHeaderRow>
            <button pdHeaderBackButton (back)="onBack($event)"></button>

            <pd-searcher
                [term]="term()"
                (search)="search.emit($event)"
                class="w-full"></pd-searcher>
        </div>
    </div>`,
    hostDirectives: [
        {
            directive: HeaderLayoutDirective,
        },
    ],
})
export class SearchHeader {
    router = inject(Router);
    search = output<string>();
    term = input<string>("");

    onBack(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }
}
