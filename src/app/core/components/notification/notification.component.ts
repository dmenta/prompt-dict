import { Component, inject } from "@angular/core";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "pd-notification",
  imports: [],
  template: `<div
      class="fixed duration-200 m-auto z-35 scale-0 left-0 right-0 w-fit shadow-lg shadow-black/30 dark:shadow-black/60 transition-all ease-out"
      [class.-bottom-18]="!notificationService.showNotification()"
      [class.bottom-8]="notificationService.showNotification()"
      [class.scale-100]="notificationService.showNotification()">
      <div class="rounded-lg w-64 flex bg-gray-50 dark:bg-gray-800 items-center gap-4 pl-2 py-3">
        @if(notificationService.notificationMessage().type === 'warn') {
        <span
          class="dark:bg-orange-500 bg-orange-400 font-museo-moderno font-semibold text-white p-0.5 px-1.5 text-smaller-3 rounded-lg"
          >WARN</span
        >
        } @else {
        <span
          class="dark:bg-green-700 bg-green-600 font-museo-moderno font-semibold text-white p-0.5 px-1.5 text-smaller-2 rounded-lg"
          >OK</span
        >
        }
        <span class="w-full">{{ notificationService.notificationMessage().message }}</span>
      </div>
    </div>
    <div
      class="fixed top-0 left-0 z-30 bg-black/10 dark:bg-black/20 block opacity-100 w-screen h-screen"
      [class.hidden]="!notificationService.showNotification()"></div>`,
})
export class StatusNotification {
  notificationService = inject(NotificationService);
}
