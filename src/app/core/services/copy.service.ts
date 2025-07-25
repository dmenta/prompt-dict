import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({
    providedIn: "root",
})
export class CopyService {
    private readonly notificationService = inject(NotificationService);

    public copy(value: string, message?: string) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(value);
            this.notificationService.success(message ?? "Copiado!");
        } else {
            this.notificationService.warn(message ?? "No se puede copiar!");
        }
    }
}
