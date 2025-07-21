import { Component, effect, inject, Output, output, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AppDataService } from "../../../core/services/app-data.service";
import { NotificationService } from "../../../core/services/notification.service";
import { TitleCasePipe } from "@angular/common";
import { map } from "rxjs";
import { FirestorePrompt } from "../../../core";

@Component({
    selector: "pd-create-prompt-form",
    standalone: true,
    imports: [ReactiveFormsModule, TitleCasePipe],
    templateUrl: "./create-prompt-form.component.html",
})
export class CreatePromptFormComponent {
    notificationService = inject(NotificationService);
    isSubmitting = signal<boolean>(false);
    private formBuilder = inject(FormBuilder);
    private appData = inject(AppDataService);

    usoOptions = ["texto", "código", "imagen", "video", "audio", "otro"];
    idiomaOptions = [
        { value: "es-AR", label: "Español (Argentina)" },
        { value: "EN", label: "English" },
    ];

    categorias = signal<string[]>([]);
    tags = signal<string[]>([]);

    form: FormGroup = this.formBuilder.nonNullable.group({
        titulo: ["", [Validators.required, this.trimValidator]],
        descripcion: ["", Validators.required, this.trimValidator],
        autor: ["", [Validators.required, this.trimValidator]],
        categoria: ["", [Validators.required, this.trimValidator]],
        tags: [[], [Validators.required]],
        prompt: ["", [Validators.required, this.trimValidator]],
        uso: ["texto", [Validators.required]],
        idioma: ["es-AR", [Validators.required]],
    });

    @Output() valid = this.form.statusChanges.pipe(map((status) => status === "VALID"));

    submiting = output<boolean>();

    async trimValidator(control: any): Promise<{ [key: string]: boolean } | null> {
        if (typeof control.value === "string" && control.value.trim().length === 0) {
            return { trim: true };
        }
        return null;
    }

    constructor() {
        this.appData.categories().then((cats) => this.categorias.set([...cats.map((c) => c.name)]));
        this.appData.tags().then((tags) => this.tags.set([...tags.map((t) => t.name)]));
    }

    async submit() {
        this.submiting.emit(true);
        await this.onSubmit().then(() => {
            this.submiting.emit(false);
        });
    }

    async onSubmit() {
        if (this.form.invalid || this.isSubmitting()) return;
        this.isSubmitting.set(true);

        try {
            const raw = this.form.value;
            const categoria = raw.categoria.trim().toLowerCase();
            const tags =
                typeof raw.tags === "string"
                    ? raw.tags
                          .split(",")
                          .map((t: string) => t.trim().toLowerCase())
                          .filter((t: string) => t)
                    : Array.isArray(raw.tags)
                    ? raw.tags.map((t: string) => t.trim().toLowerCase())
                    : [];
            const titulo = raw.titulo.trim();
            const promptData = {
                titulo,
                descripcion: raw.descripcion.trim(),
                autor: raw.autor.trim(),
                categoria,
                tags,
                prompt: raw.prompt.trim(),
                uso: raw.uso,
                idioma: raw.idioma,
            };
            const id = await this.appData.createPrompt(promptData);
            await this.appData.updateTagsAndCategory(tags, categoria, false);
            this.form.reset();
            this.notificationService.success("Prompt creado");
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
