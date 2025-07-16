import { Component, ElementRef, inject, output, signal, ViewChild } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, startWith } from "rxjs";

@Component({
    selector: "pd-searcher",
    imports: [ReactiveFormsModule],
    template: `
        <div class="w-full">
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
                aria-activedescendant="search-option-active" />
        </div>
    `,
    styles: ``,
})
export class Searcher {
    @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;
    searchControl = new FormControl("");
    search = output<string>();

    ngAfterViewInit() {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        }, 20);

        this.searchControl.valueChanges.pipe(startWith(""), debounceTime(200)).subscribe((value) => {
            const search = value?.trim()?.toLowerCase() ?? "";
            this.search.emit(search);
        });
    }
}
