import { Component, output, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { filter } from "rxjs";
import { PreviousRouteService } from "../../services/previous-route.service";

@Component({
  selector: "pd-header",
  imports: [RouterLink, ReactiveFormsModule],
  template: ` <div
    class="sticky top-0  right-0 left-0  h-12   bg-pink-600  flex items-center
           justify-start px-2 gap-2  text-pink-100 shadow-md/30 dark:shadow-black/20">
    <a
      [routerLink]="['/prompts']"
      [queryParams]="previousRouteService.previousParams()"
      [class.hidden]="!hideBack()"
      class="h-10 w-10 flex items-center justify-center rounded-md hover:bg-pink-500  transition-colors">
      <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
      </svg>
    </a>
    <button
      [class.hidden]="hideBack()"
      (click)="open.emit(); $event.stopPropagation()"
      class="h-10 w-10 flex items-center justify-center rounded-md hover:bg-pink-500  transition-colors">
      <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </button>
    <div [class.hidden]="!hideBack()">
      <h1 class="truncate lowercase first-letter:uppercase text-xl" [title]="titulo()">
        {{ titulo() }}
      </h1>
      <div [class.hidden]="subtitulo() === ''" class="truncate lowercase first-letter:uppercase text-xs mb-1">
        {{ subtitulo() }}
      </div>
    </div>
    <div [class.hidden]="hideBack()" class="w-full pr-10">
      <input
        [formControl]="searchControl"
        type="text"
        class="w-full bg-pink-100 ring-0 outline-0 text-black placeholder:text-gray-400 placeholder:text-center rounded-2xl px-4  p-1"
        placeholder="Buscar..." />
    </div>
  </div>`,
})
export class Header {
  open = output<void>();
  titulo = signal<string>("");
  subtitulo = signal<string>("");
  hideBack = signal(false);
  searchControl = new FormControl("");

  constructor(public title: Title, private router: Router, protected previousRouteService: PreviousRouteService) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.hideBack.set(event.url !== "/prompts");

      const pageTitle = this.title.getTitle();
      const partes = pageTitle.split("|");
      this.titulo.set(partes[0]);
      if (partes.length > 1) {
        this.subtitulo.set(partes[1].trim());
      } else {
        this.subtitulo.set("");
      }
    });

    this.searchControl.valueChanges.subscribe((value) => {
      console.log("Search value changed:", value);
      // this.router.navigate([], {
      //   queryParams: { search: value },
      //   queryParamsHandling: "merge",
      // });
    });
  }
}
