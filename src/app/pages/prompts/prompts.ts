import { Component, computed, inject } from "@angular/core";
import { PromptsList } from "../../features/";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import {
    ListPrompts,
    SectionHeader,
    FirestorePrompt,
    AppDataService,
    NotificationService,
} from "../../core";
import { Title } from "@angular/platform-browser";
import { App } from "../../app";

@Component({
    selector: "pd-prompts",
    imports: [PromptsList, SectionHeader],
    template: `
        <header
            pd-section-header
            [titulo]="titulo()"
            [subtitulo]="subtitulo()"
            [enabled]="borrable()"
            (erase)="onErase($event)"></header>
        <div class="flex flex-row w-full">
            <ul pd-prompts-list class="p-4 " [prompts]="prompts()"></ul>
        </div>
    `,
    host: {
        class: " w-full ",
    },
})
export class Prompts {
    notificationService = inject(NotificationService);
    router = inject(Router);
    private route = inject(ActivatedRoute);
    private persist = inject(AppDataService);

    private data = toSignal(
        this.route.data as Observable<{
            type: { title: string; lowercase: string };
            item: ListPrompts;
        }>
    );

    prompts = computed(() => <FirestorePrompt[]>this.data()!.item.prompts);
    titulo = computed(() => <string>this.data()!.item.name);
    subtitulo = computed(() =>
        this.resolvedSubtitulo(this.prompts().length, this.data()!.type.lowercase)
    );
    borrable = computed(() => this.prompts().length <= 0);

    constructor(title: Title) {
        title.setTitle(`${this.data()?.item.name} | ${this.data()?.type.title} | Prompter`);
    }

    onErase(event: MouseEvent) {
        event.stopPropagation();
        if (!this.borrable()) {
            return;
        }
        if (this.data()?.type.lowercase === "etiqueta") {
            this.persist.deleteTag(this.data()?.item.name!).then(() => {
                this.notificationService.success("Etiqueta eliminada.");
                this.router.navigate(["/"]);
            });
        } else {
            this.persist.deleteCategory(this.data()?.item.name!).then(() => {
                this.notificationService.success("Categoría eliminada.");
                this.router.navigate(["/"]);
            });
        }
    }
    private resolvedSubtitulo(numItems: number, type: string): string {
        const mensajeCantidad =
            numItems === 0
                ? "Ningún prompt asociado"
                : numItems === 1
                ? "1 prompt asociado"
                : `${numItems.toFixed(0)} prompts asociados`;

        return `${mensajeCantidad} a esta ${type}`;
    }
}
