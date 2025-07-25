import {
    ApplicationConfig,
    inject,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, Router, withNavigationErrorHandler } from "@angular/router";

import { routes } from "./app.routes";
import { NotificationService } from "./core";
import { APP_BASE_HREF, PlatformLocation } from "@angular/common";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideFirestore, getFirestore } from "@angular/fire/firestore";
import { environment } from "../environments/environment";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFunctions } from "firebase/functions";
import { provideFunctions } from "@angular/fire/functions";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
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
        {
            provide: APP_BASE_HREF,
            useFactory: getBaseHref,
        },
        // Firebase providers
        provideFirestore(() => getFirestore()),
        provideFunctions(() => getFunctions()),
    ],
};

export function getBaseHref(): string {
    const platformLocation = inject(PlatformLocation);
    return platformLocation.getBaseHrefFromDOM();
}
