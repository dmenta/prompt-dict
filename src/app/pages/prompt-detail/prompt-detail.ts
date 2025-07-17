import { Component, inject, signal } from "@angular/core";
import { Prompt } from "../../features/prompts/prompt";
import { PersistService } from "../../core/services/persist.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DetailHeader } from "../../core/components/header/detail-header";
import { CopyService } from "../../core/services/copy.service";
import { PromptNotFound } from "../../features/prompts/prompt-not-found/prompt-not-found";
import { LabelValueItem } from "../../core/components/key-value-item/label-value-item";
import { NotificationService } from "../../core/services/notification.service";

@Component({
    selector: "pd-prompt-detail",
    imports: [DetailHeader, PromptNotFound, LabelValueItem],
    template: `<header
            pd-detail-header
            [titulo]="titulo()"
            (copyPrompt)="onCopyPrompt($event)"
            (share)="onShare($event)"></header>
        <div class="px-6 py-6 w-full">
            @if(prompt(); as promptOk) {
            <ul class="divide-y-[0.5px] space-y-2">
                @for( property of displayProperties; track property.key) {
                <li pd-key-value-item [label]="property.label" [value]="promptOk[property.key]"></li>
                }
            </ul>
            } @else {
            <pd-prompt-not-found></pd-prompt-not-found>}
        </div>`,
    host: {
        class: "w-full",
    },
})
export class PromptDetail {
    persistService = inject(PersistService);
    activatedRoute = inject(ActivatedRoute);
    copyService = inject(CopyService);
    notifier = inject(NotificationService);

    url = signal<string>(window.location.origin + window.location.pathname);
    prompt = signal<Prompt | null>(null);

    displayProperties: { label: string; key: keyof Prompt }[] = [
        { label: "Título", key: "titulo" },
        { label: "Texto", key: "prompt" },
        { label: "Descripción", key: "descripcion" },
        { label: "Autor", key: "autor" },
        { label: "Categoría", key: "categoria" },
        { label: "Creado", key: "fechaCreacion" },
        { label: "Etiquetas", key: "tags" },
        { label: "ID", key: "id" },
    ];
    titulo = signal<string>("");

    onCopyPrompt(event: MouseEvent) {
        event.stopPropagation();

        const promptText = this.prompt()?.prompt;
        if (promptText) {
            this.copyService.copy(promptText);
        }
    }

    async onShare(event: MouseEvent) {
        event.stopPropagation();

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
        }
    }

    constructor(private title: Title) {
        this.activatedRoute.params.subscribe((params: Params) => {
            const id = Number(params["id"]);
            const prompt = Number.isInteger(id) && Number.isFinite(id) ? this.persistService.byId(id) : null;

            if (prompt) {
                this.prompt.set(prompt);
                this.titulo.set(prompt.titulo);
                this.title.setTitle(`Prompt | ${prompt.titulo}`);
            } else {
                this.titulo.set("No encontrado");
                this.title.setTitle("Prompt no encontrado");
            }
        });
    }
}
