import { Component, inject } from "@angular/core";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: "pd-notification",
    imports: [],
    template: `<div
            class="fixed duration-200 m-auto z-35 scale-0 left-0 right-0 w-fit  shadow-lg shadow-black/30 dark:shadow-black/60 transition-all ease-out"
            [class.-bottom-8]="!notificationService.showNotification()"
            [class.bottom-18]="notificationService.showNotification()"
            [class.scale-100]="notificationService.showNotification()">
            <div class="rounded-lg w-full flex bg-neutral-50 dark:bg-neutral-800 items-center gap-4 p-3">
                <span class="w-full pl-1">{{ notificationService.notificationMessage().message }}</span>
                @if(notificationService.notificationMessage().type === 'warn') {
                <span class="dark:text-amber-400 font-semibold text-amber-600 p-0.5 px-1.5 rounded-lg">WARN</span>
                } @else if(notificationService.notificationMessage().type === '404') {
                <span class="dark:text-red-400 font-semibold text-red-500 p-0.5 px-1.5 rounded-lg">404</span>
                } @else {
                <span class=" dark:text-green-300 font-semibold text-green-800 p-0.5 px-1.5 rounded-lg">OK</span>
                }
            </div>
        </div>
        <div
            class="fixed top-0 left-0 z-30 bg-black/10 dark:bg-black/20 block opacity-100 w-screen h-screen"
            [class.hidden]="!notificationService.showNotification()"></div>`,
})
export class StatusNotification {
    notificationService = inject(NotificationService);
}
