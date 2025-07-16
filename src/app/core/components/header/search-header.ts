import { Component, input, output } from "@angular/core";
import { Router } from "@angular/router";
import { Header } from "./header";
import { StickyHeader } from "./sticky-header";
import { Searcher } from "../searcher/searcher";

@Component({
    selector: "pd-search-header , [pd-search-header]",
    imports: [Header, Searcher],
    template: `<pd-header (mainButtonClicked)="onMainButtonClick($event)">
        <svg nav-button height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        <pd-searcher (search)="search.emit($event)"></pd-searcher>
    </pd-header>`,
    hostDirectives: [StickyHeader],
})
export class SearchHeader {
    search = output<string>();
    constructor(private router: Router) {}

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.router.navigate(["/"]);
    }
}
