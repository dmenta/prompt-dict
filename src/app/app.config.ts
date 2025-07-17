import {
    ApplicationConfig,
    inject,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, Router, withNavigationErrorHandler } from "@angular/router";

import { routes } from "./app.routes";
import { NotificationService } from "./core/services/notification.service";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(
            routes,
            withNavigationErrorHandler((error) => {
                const notifier = inject(NotificationService);

                const router = inject(Router);
                if (error?.error.message) {
                    notifier.notFound(error.error.message);
                    console.warn("Ocurrió un error al navegar", error.error.message);
                }
                router.navigate(["/"]);
            })
        ),
    ],
};
