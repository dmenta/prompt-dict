import { Component, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PersistService } from "../../services/persist.service";

@Component({
  selector: "pd-searcher",
  imports: [ReactiveFormsModule],
  template: `
    <div class="w-full">
      <input
        [formControl]="searchControl"
        type="text"
        class="w-full bg-white dark:bg-gray-950 ring-0 outline-0 dark:text-white text-black dark:placeholder:text-gray-400 placeholder:text-gray-400 placeholder:text-center rounded-full px-6  p-1.5"
        placeholder="Buscar prompts..."
        aria-label="Buscar prompts"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-controls="search-options"
        aria-activedescendant="search-option-active"
        (keyup.enter)="onSearch()"
        list="search-options" />
    </div>
  `,
  styles: ``,
})
export class Searcher {
  private router = inject(Router);
  persistService = inject(PersistService);

  onSearch() {
    const searchTerm = this.searchControl.value?.trim().toLowerCase();
    this.searchControl.setValue("");

    this.router.navigate(["/prompts"], {
      queryParams: { search: searchTerm },
    });
  }
  searchControl = new FormControl("");

  items = signal<{ id: number; texto: string }[]>([]);

  constructor() {
    this.searchControl.valueChanges.subscribe((value) => {
      const search = value?.trim()?.toLowerCase() ?? "";
      console.log("Search value changed:", value);
      if (search.length > 2) {
        this.items.set(this.persistService.search(value!).prompts.map((p) => ({ id: p.id, texto: p.titulo })));
      } else {
        this.items.set([]);
      }
    });
  }
}
