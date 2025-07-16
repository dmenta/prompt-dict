import { Component, output } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Searcher } from "../searcher/searcher";
import { ModeToggle } from "../mode-toggle/mode-toggle";
import { Header } from "./header";
import { StickyHeader } from "./sticky-header";

@Component({
    selector: "pd-main-header, [pd-main-header]",
    imports: [Header, Searcher, ModeToggle],
    template: `<pd-header (mainButtonClicked)="onMainButtonClick($event)">
        <svg nav-button height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
        <pd-searcher (click)="onSearch()"></pd-searcher>
        <pd-mode-toggle trailing-items></pd-mode-toggle>
    </pd-header>`,
    hostDirectives: [StickyHeader],
})
export class MainHeader {
    onSearch() {
        this.router.navigate(["/searching"]);
    }
    open = output<void>();

    onMainButtonClick(event: MouseEvent) {
        event.stopPropagation();
        this.open.emit();
    }

    constructor(public title: Title, private router: Router) {
        this.title.setTitle("Prompter");
    }
}
