import { Component, ElementRef, inject, input, output, signal, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, startWith } from "rxjs";
import { HeaderButton } from "../header/buttons/header-button";
import { IconDirective } from "../../directives";

@Component({
    selector: "pd-searcher",
    imports: [ReactiveFormsModule, HeaderButton, IconDirective],
    template: `
        <div class="w-full flex flex-row items-center  gap-2">
            <input
                #searchInput
                tabindex="0"
                [formControl]="searchControl"
                type="text"
                class="w-full text-primary-contrast  p-1.5 ring-0 outline-0 border-b-[1px] border-dotted border-b-contrast"
                autofocus
                placeholder="Buscar prompts..."
                aria-label="Buscar prompts"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-controls="search-options"
                aria-activedescendant="search-option-active"
                (keydown.enter)="onSearch()" />
            <button
                pdHeaderButton
                title="Abrir menú"
                aria-label="Abrir menú"
                (click)="clear($event)"
                pdIcon="close"></button>
        </div>
    `,
    styles: ``,
})
export class Searcher {
    clear(event: MouseEvent) {
        event.stopPropagation();
        this.searchControl.setValue("");
        this.search.emit("");
    }

    @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;
    searchControl = new FormControl("");
    search = output<string>();
    term = input<string>("");
    onSearch() {
        this.search.emit(this.searchControl.value?.trim() ?? "");
        this.searchInput.nativeElement.blur();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 20);

        this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
            const search = value?.trim() ?? "";
            this.search.emit(search);
        });
        this.searchControl.setValue(this.term());
    }
}
