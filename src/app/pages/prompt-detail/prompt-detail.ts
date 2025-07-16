import { Component, inject, input, signal } from "@angular/core";
import { Prompt } from "../../features/prompts/prompt";
import { PersistService } from "../../core/services/persist.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DetailHeader } from "../../core/components/header/detail-header";
import { CopyService } from "../../core/services/copy.service";
import { PromptNotFound } from "../../features/prompts/prompt-not-found/prompt-not-found";

@Component({
    selector: "pd-prompt-detail",
    imports: [DetailHeader, PromptNotFound],
    template: `<header pd-detail-header [titulo]="titulo()" (copyPrompt)="onCopyPrompt()"></header>
        <div class="px-6 py-6 w-full">
            @if(prompt(); as promptOk) {
            <ul class="divide-y-[0.5px] space-y-2">
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">Título</div>
                    <div class="text-md text-inverse">{{ promptOk.titulo }}</div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80 ">Texto</div>
                    <div class="text-md text-inverse">{{ promptOk.prompt }}</div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">Descripción</div>
                    <div class="text-md text-inverse">{{ promptOk.descripcion }}</div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">Autor</div>
                    <div class="text-md text-inverse">{{ promptOk.autor }}</div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">Categoría</div>
                    <div class="text-md text-inverse">{{ promptOk.categoria }}</div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">Creado</div>
                    <div class="text-md text-inverse">
                        {{ promptOk.fechaCreacion.toLocaleDateString() }}
                    </div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">Etiquetas</div>
                    <div class="text-md text-inverse">{{ promptOk.tags.join(", ") }}</div>
                </li>
                <li class="flex flex-col  pt-1 pb-3 items-start justify-center">
                    <div class="text-sm text-inverse opacity-80">ID</div>
                    <div class="text-md text-inverse">{{ promptOk.id }}</div>
                </li>
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

    prompt = signal<Prompt | null>(null);
    titulo = signal<string>("");

    onCopyPrompt() {
        const promptText = this.prompt()?.prompt;
        if (promptText) {
            this.copyService.copy(promptText);
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
