import { Component, OnDestroy, Renderer2, signal } from "@angular/core";

@Component({
    selector: "pd-drawer, [pd-drawer]",
    imports: [],
    template: `
        <div
            class="drawer  shadow-lg/60 dark:shadow-lg/70 md:shadow-sm/40 md:dark:shadow-md/70  fixed md:top-14 top-0  z-14 dark:shadow-black shadow-black/80  bg-drawer bottom-0 overflow-hidden"
            [class.open]="isOpen()"
            (click)="onClick()">
            <ng-content></ng-content>
        </div>
        <div
            class="fixed md:hidden top-0 left-0 z-12 bg-black/10 dark:bg-black/20 block opacity-100 w-screen h-screen"
            [class.hidden]="!isOpen()"></div>
    `,
    host: {
        class: "",
    },
})
export class Drawer implements OnDestroy {
    public readonly isOpen = signal(false);

    private removeDocumentClickListenerFn: (() => void) | null = null;
    private removeDocumentEscapeListenerFn: (() => void) | null = null;

    constructor(private renderer: Renderer2) {
        this.setListeners();
    }

    public show() {
        if (this.isOpen() === true) {
            return;
        }

        this.isOpen.set(true);
        this.setListeners();
    }
    public hide() {
        if (!this.isOpen()) {
            return;
        }
        this.isOpen.set(false);

        this.removeDocumentClickListenerFn?.();
        this.removeDocumentEscapeListenerFn?.();
    }

    protected onClick() {
        this.hide();
    }

    private setListeners() {
        if (this.isOpen() === true) {
            this.removeDocumentClickListenerFn = this.renderer.listen("document", "click", () =>
                this.hide()
            );
            this.removeDocumentEscapeListenerFn = this.renderer.listen(
                "document",
                "keydown.escape",
                () => this.hide(),
                {
                    passive: true,
                }
            );
        }
    }

    ngOnDestroy() {
        this.removeDocumentClickListenerFn?.();
        this.removeDocumentEscapeListenerFn?.();
    }
}
