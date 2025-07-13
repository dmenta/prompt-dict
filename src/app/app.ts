import { Component, computed, signal } from "@angular/core";
import { Drawer } from "./core/components/drawer/drawer";
import { Header } from "./core/components/header/header";
import { CategoriesList } from "./features/categories/categories-list/categories-list";
import { StatusNotification } from "./core/components/notification/notification.component";
import { RouterOutlet } from "@angular/router";
import { TagsList } from "./features/tags/tags-list/tags-list";

@Component({
  selector: "pd-root",
  imports: [CategoriesList, TagsList, Drawer, Header, StatusNotification, RouterOutlet],
  template: `
    <div class="p-0 m-0 overflow-hidden w-screen h-screen">
      <pd-header class="z-10" (open)="drawer.show()"></pd-header>
      <pd-drawer class="w-fit" #drawer>
        <div
          (click)="onClick($event, list() === 'categories' ? 'tags' : 'categories')"
          drawer-title
          class="flex items-center justify-between w-full"
          [class.flex-row]="list() === 'categories'"
          [class.flex-row-reverse]="list() === 'tags'">
          <span class="font-semibold text-pink-950">{{ activo() }}</span>
          <span>{{ inactivo() }}</span>
        </div>

        @if(list()==="categories") {
        <pd-categories-list></pd-categories-list>
        } @else {
        <pd-tags-list></pd-tags-list>
        }
      </pd-drawer>
      <div class="h-[calc(100svh_-_3rem)] overflow-hidden flex flex-row">
        <router-outlet></router-outlet>
      </div>
    </div>
    <pd-notification></pd-notification>
  `,
})
export class App {
  list = signal<"categories" | "tags">("categories");

  onClick(event: MouseEvent, what: "categories" | "tags") {
    event.stopPropagation();
    this.list.set(what);
  }

  inactivo = computed(() => {
    return this.list() === "categories" ? "Etiquetas" : "Categorías";
  });

  activo = computed(() => {
    return this.list() === "categories" ? "Categorías" : "Etiquetas";
  });
}
