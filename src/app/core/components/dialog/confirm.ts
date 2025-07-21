import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    input,
    output,
} from "@angular/core";
import { SimpleButton } from "../../directives";

@Component({
    selector: "pd-dialog",
    imports: [SimpleButton],
    template: `<dialog
        #pdDialog
        closeBy="any"
        class="backdrop:bg-neutral-500/20 fixed top-1/3 left-1/2  -translate-x-1/2  w-fit h-fit max-w-screen-sm shadow-lg/50 shadow-black/40 p-3 bg-white dark:bg-neutral-700">
        <h1 class="text-2xl font-semibold px-2 mb-4">
            {{ dialogTitle() }}
        </h1>
        <div class="p-3">
            <ng-content></ng-content>
        </div>
        <form class="flex items-center justify-end gap-2 text-sm">
            <button
                pd-button
                type="button"
                (click)="onConfirm($event)"
                class="hover:bg-neutral-200 hover:dark:bg-neutral-600 bg-neutral-100 dark:bg-neutral-700 rounded-md">
                Sí
            </button>
            <button
                pd-button
                autofocus
                type="button"
                class="hover:bg-neutral-200 hover:dark:bg-neutral-600 bg-neutral-300 dark:bg-neutral-800 rounded-md"
                (click)="pdDialog.close(); $event.stopPropagation()">
                No
            </button>
        </form>
    </dialog>`,
})
export class DialogComponent implements OnDestroy {
    @ViewChild("pdDialog", { static: true }) dialog!: ElementRef<HTMLDialogElement>;
    dialogTitle = input<string>("");

    confirm = output<MouseEvent>();

    show() {
        this.dialog.nativeElement.showModal();
    }

    onConfirm(event: MouseEvent) {
        this.dialog.nativeElement.close();
        this.confirm.emit(event);
    }

    ngOnDestroy(): void {
        this.dialog.nativeElement.close();
    }
}
