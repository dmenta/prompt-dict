import { Component, inject } from "@angular/core";
import { Drawer } from "./core/components/drawer/drawer";
import { Header } from "./core/components/header/header";
import { CategoriesList } from "./features/categories/categories-list/categories-list";
import { StatusNotification } from "./core/components/notification/notification.component";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterOutlet } from "@angular/router";

@Component({
  selector: "pd-root",
  imports: [CategoriesList, Drawer, Header, StatusNotification, RouterOutlet],
  template: `
    <div class="p-0 m-0 overflow-hidden w-screen h-screen">
      <pd-header class="z-10" (open)="drawer.show()">Prompter</pd-header>
      <div class="h-[calc(100svh_-_3rem)] overflow-hidden flex flex-row">
        <pd-drawer class="w-fit" #drawer>
          <div drawer-title>Tags</div>
          <pd-categories-list></pd-categories-list>
        </pd-drawer>
        <router-outlet></router-outlet>
      </div>
    </div>
    <pd-notification></pd-notification>
  `,
})
export class App {}
