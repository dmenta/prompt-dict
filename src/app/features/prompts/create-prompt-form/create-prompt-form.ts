import { Component, inject, Output, output, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AppDataService, NotificationService } from "../../../core";
import { TitleCasePipe } from "@angular/common";
import { map } from "rxjs";

@Component({
    selector: "pd-create-prompt-form",
    standalone: true,
    imports: [ReactiveFormsModule, TitleCasePipe],
    templateUrl: "./create-prompt-form.html",
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
        this.appData
            .categories()
            .subscribe((cats) => this.categorias.set([...cats.map((c) => c.name)]));
        this.appData.tags().subscribe((tags) => this.tags.set([...tags.map((t) => t.name)]));
    }

    async onSubmit(event: Event) {
        event.stopPropagation();
        if (this.form.invalid || this.isSubmitting()) {
            return;
        }
        this.submiting.emit(true);
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

            await this.appData.createPrompt(promptData);

            this.form.reset();
            this.notificationService.success("Prompt creado");
        } finally {
            this.isSubmitting.set(false);
            this.submiting.emit(false);
        }
    }
}
