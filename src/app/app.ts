import { Component, computed, inject, signal } from "@angular/core";
import { Drawer } from "./core/components/drawer/drawer";
import { Header } from "./core/components/header/header";
import { StatusNotification } from "./core/components/notification/notification.component";
import { RouterOutlet } from "@angular/router";
import { NavList } from "./features/navigation/nav-list/nav-list";
import { DarkModeService } from "./core/services/dark-mode.service";

@Component({
  selector: "pd-root",
  imports: [NavList, Drawer, Header, StatusNotification, RouterOutlet],
  template: `
    <div class="p-0 m-0 overflow-hidden w-screen h-screen select-none ">
      <pd-header class="z-10" (open)="drawer.show()"></pd-header>
      <pd-drawer class="w-fit  select-none" #drawer>
        <div
          drawer-title
          class="flex items-center justify-between w-full"
          [class.flex-row]="list() === 'category'"
          [class.flex-row-reverse]="list() === 'tag'">
          <span class="font-semibold text-list-name" (click)="$event.stopImmediatePropagation()">{{ activo() }}</span>
          <span
            class="opacity-85 font-light hover:opacity-100"
            (click)="onClick($event, list() === 'category' ? 'tag' : 'category')"
            >{{ inactivo() }}</span
          >
        </div>

        <pd-nav-list [list]="list()"></pd-nav-list>
      </pd-drawer>
      <div class="h-[calc(100svh_-_3.5rem)] overflow-hidden flex flex-row">
        <router-outlet></router-outlet>
      </div>
    </div>
    <pd-notification></pd-notification>
  `,
})
export class App {
  mode = inject(DarkModeService);
  list = signal<"category" | "tag">("category");

  onClick(event: MouseEvent, what: "category" | "tag") {
    event.stopPropagation();
    this.list.set(what);
  }

  inactivo = computed(() => {
    return this.list() === "category" ? "Etiquetas" : "Categorías";
  });

  activo = computed(() => {
    return this.list() === "category" ? "Categorías" : "Etiquetas";
  });
}
