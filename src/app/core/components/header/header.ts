import { Component, output, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter } from "rxjs";
import { PreviousRouteService } from "../../services/previous-route.service";
import { Searcher } from "../searcher/searcher";

@Component({
  selector: "pd-header",
  imports: [RouterLink, Searcher],
  template: ` <div
    class="sticky top-0  right-0 left-0  h-12  flex items-center
           justify-start px-2 gap-2  dark:bg-gray-900 dark:text-white bg-gray-200 text-black">
    <a
      [routerLink]="['./']"
      [queryParams]="previousRouteService.previousParams()"
      [class.hidden]="!hideBack()"
      class="h-10 w-10 flex items-center justify-center rounded-md dark:hover:bg-gray-800 hover:bg-gray-200  transition-colors">
      <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
      </svg>
    </a>
    <button
      [class.hidden]="hideBack()"
      (click)="open.emit(); $event.stopPropagation()"
      class="h-10 w-10 flex items-center justify-center rounded-md dark:hover:bg-gray-800 hover:bg-gray-200  transition-colors">
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
      <pd-searcher></pd-searcher>
    </div>
  </div>`,
})
export class Header {
  open = output<void>();
  titulo = signal<string>("");
  subtitulo = signal<string>("");
  hideBack = signal(false);

  constructor(public title: Title, private router: Router, protected previousRouteService: PreviousRouteService) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.hideBack.set(event.url !== "/");

      const pageTitle = this.title.getTitle();
      const partes = pageTitle.split("|");
      this.titulo.set(partes[0]);
      if (partes.length > 1) {
        this.subtitulo.set(partes[1].trim());
      } else {
        this.subtitulo.set("");
      }
    });
  }
}
