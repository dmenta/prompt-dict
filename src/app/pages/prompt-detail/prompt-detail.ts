import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import {
    CopyService,
    DetailHeader,
    LabelValueItem,
    FirestorePrompt,
    AppDataService,
    NotificationService,
} from "../../core";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "pd-prompt-detail",
    imports: [DetailHeader, LabelValueItem],
    template: `<header
            pd-detail-header
            [titulo]="prompt().titulo"
            (delete)="onDelete($event)"
            (copyPrompt)="onCopyPrompt($event)"
            (share)="onShare($event)"></header>
        <div class="px-6 py-6 w-full">
            <ul class="divide-y-[0.5px] divide-gray-500/50 space-y-2">
                @for( property of displayProperties; track property.key) {
                <li
                    pd-key-value-item
                    [label]="property.label"
                    [value]="prompt()[property.key]"></li>
                }
            </ul>
        </div>`,
    host: {
        class: "w-full",
    },
})
export class PromptDetail {
    notificationService = inject(NotificationService);
    private persistService = inject(AppDataService);
    private url = signal<string>(window.location.href);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private data = toSignal(this.route.data as Observable<{ prompt: FirestorePrompt }>);
    private copyService = inject(CopyService);
    prompt = computed(() => <FirestorePrompt>this.data()!.prompt);

    displayProperties: { label: string; key: keyof FirestorePrompt }[] = [
        { label: "Título", key: "titulo" },
        { label: "Texto", key: "prompt" },
        { label: "Descripción", key: "descripcion" },
        { label: "Autor", key: "autor" },
        { label: "Categoría", key: "categoria" },
        { label: "Creado", key: "fecha_creacion" },
        { label: "Etiquetas", key: "tags" },
        { label: "ID", key: "id" },
    ];

    constructor(title: Title) {
        title.setTitle(`${this.prompt().titulo} | Prompter`);
    }

    onDelete(event: MouseEvent) {
        event.stopPropagation();

        this.persistService
            .deletePrompt(this.prompt().id)
            .then(() => {
                this.notificationService.success("Prompt eliminado");
                this.router.navigate(["/"]);
            })
            .catch((error) => {
                this.notificationService.warn("Error al eliminar el prompt: " + error.message);
            });
    }

    onCopyPrompt(event: MouseEvent) {
        event.stopPropagation();

        this.copyService.copy(this.prompt().prompt);
    }

    async onShare(event: MouseEvent) {
        event.stopPropagation();

        if (!navigator.canShare) {
            this.copyService.copy(this.url());
            return;
        }

        const prompt = this.prompt()!;
        const url = this.url();
        const data = {
            title: "Prompter",
            text: prompt.titulo,
            url: url,
        };

        if (navigator.canShare(data)) {
            try {
                await navigator.share(data);
            } catch (error) {
                console.warn("Error al compartir el prompt:", error);
            }
        } else {
            this.copyService.copy(this.url());
        }
    }
}
