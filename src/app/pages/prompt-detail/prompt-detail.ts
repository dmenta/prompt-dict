import { Component, computed, inject, signal } from "@angular/core";
import { Prompt } from "../../features/prompts/prompt";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import { CopyService, DetailHeader, LabelValueItem } from "../../core";

@Component({
    selector: "pd-prompt-detail",
    imports: [DetailHeader, LabelValueItem],
    template: `<header
            pd-detail-header
            [titulo]="prompt().titulo"
            (copyPrompt)="onCopyPrompt($event)"
            (share)="onShare($event)"></header>
        <div class="px-6 py-6 w-full">
            <ul class="divide-y-[0.5px] space-y-2">
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
    private url = signal<string>(window.location.href);
    private route = inject(ActivatedRoute);
    private data = toSignal(this.route.data as Observable<{ prompt: Prompt }>);
    private copyService = inject(CopyService);
    prompt = computed(() => <Prompt>this.data()!.prompt);

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
