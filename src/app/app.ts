import { Component, inject } from "@angular/core";
import { StatusNotification } from "./core/components/notification/notification.component";
import { RouterOutlet } from "@angular/router";
import { DarkModeService } from "./core/services/dark-mode.service";

@Component({
  selector: "pd-root",
  imports: [StatusNotification, RouterOutlet],
  template: `
    <div class="p-0 m-0  w-full h-full select-none">
      <router-outlet></router-outlet>
    </div>
    <pd-notification></pd-notification>
  `,
})
export class App {
  mode = inject(DarkModeService);
}
