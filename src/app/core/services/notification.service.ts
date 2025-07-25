import { Injectable, OnDestroy, signal } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class NotificationService implements OnDestroy {
    public readonly showNotification = signal(false);

    public readonly notificationMessage = signal<{
        type: "404" | "success" | "warn";
        message?: string;
    }>({
        type: "success",
        message: "",
    });

    private lastTimeoutId: number | undefined = undefined;
    private abort: AbortController | undefined = undefined;

    public success(message?: string) {
        this.notificationMessage.set({ type: "success", message: message ?? "" });
        this.setNotification(true);
    }

    public warn(message?: string) {
        this.notificationMessage.set({ type: "warn", message: message ?? "" });
        this.setNotification(true);
    }

    public notFound(message?: string) {
        this.notificationMessage.set({ type: "404", message: message ?? "" });
        this.setNotification(true);
    }

    private setNotification(show: boolean) {
        this.showNotification.set(show);

        this.abort?.abort();

        if (this.showNotification()) {
            this.abort = new AbortController();
            const abortar = this.abort.signal;

            window.addEventListener("keydown", this.onKeyDown.bind(this), {
                once: true,
                signal: abortar,
                capture: true,
            });
            window.addEventListener("click", this.onClick.bind(this), {
                once: true,
                signal: abortar,
                capture: true,
            });

            this.setHideTimeout();
        } else {
            this.clearHideTimeout();
        }
    }

    private setHideTimeout() {
        this.clearHideTimeout();
        this.lastTimeoutId = window.setTimeout(() => {
            this.setNotification(false);
        }, 3000);
    }
    private clearHideTimeout() {
        if (this.lastTimeoutId) {
            clearTimeout(this.lastTimeoutId);
            this.lastTimeoutId = undefined;
        }
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            this.setNotification(false);
        }
    }
    private onClick(_event: MouseEvent) {
        this.setNotification(false);
    }

    ngOnDestroy() {
        this.abort?.abort();
    }
}
