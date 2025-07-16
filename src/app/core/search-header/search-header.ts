import { Component, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { PreviousRouteService } from "../services/previous-route.service";
import { filter } from "rxjs";
import { ModeToggle } from "../components/mode-toggle/mode-toggle";
import { Searcher } from "../components/searcher/searcher";

@Component({
  selector: "pd-search-header",

  imports: [RouterLink, Searcher, ModeToggle],
  template: ` <div
    class="h-14 flex  items-center overflow-hidden
           justify-between px-3 gap-2  z-10  bg-header text-header-contrast">
    <a
      [routerLink]="['./']"
      class="h-10 min-w-10 flex items-center justify-center rounded-md hover:bg-button-hover transition-colors">
      <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
      </svg>
    </a>
    <div [class.hidden]="!hideBack()" class="overflow-hidden w-full flex flex-col">
      <h1 class="w-full inline-block truncate lowercase first-letter:uppercase text-xl" [title]="titulo()">
        {{ titulo() }}
      </h1>
      <div [class.hidden]="subtitulo() === ''" class="truncate lowercase first-letter:uppercase text-xs">
        {{ subtitulo() }}
      </div>
    </div>
    <div [class.hidden]="hideBack()" class="w-full">
      <pd-searcher></pd-searcher>
    </div>
    <pd-mode-toggle></pd-mode-toggle>
  </div>`,
})
export class SearchHeader {
  titulo = signal<string>("");
  subtitulo = signal<string>("");
  hideBack = signal(false);

  constructor(public title: Title, private router: Router, protected previousRouteService: PreviousRouteService) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.hideBack.set(event.url !== "/");

      const pageTitle = this.title.getTitle();
      const partes = pageTitle.split("|");
      if (partes.length > 1) {
        this.titulo.set(partes[1].trim());
        this.subtitulo.set(partes[0].trim());
      } else {
        this.titulo.set(partes[0].trim());
        this.subtitulo.set("");
      }
    });
  }
}
