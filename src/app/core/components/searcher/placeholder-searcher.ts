import { Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "pd-placeholder-searcher",
    imports: [ReactiveFormsModule],
    template: `
        <div class="w-full" (click)="$event.stopPropagation(); router.navigate(['/searching'])">
            <input
                type="text"
                readonly
                class="w-full bg-search ring-0 outline-0 text-search-contrast placeholder:text-placeholder placeholder:text-center rounded-full px-6  p-1.5"
                placeholder="Buscar prompts..."
                aria-label="Buscar prompts"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-controls="search-options"
                aria-activedescendant="search-option-active" />
        </div>
    `,
})
export class PlaceholderSearcher {
    router = inject(Router);
}
