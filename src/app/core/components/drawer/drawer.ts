import { AfterViewInit, Component, ElementRef, input, model, OnDestroy, Renderer2, signal } from "@angular/core";

@Component({
  selector: "pd-drawer",
  imports: [],
  template: `
    <div
      class="drawer  shadow-lg/60   absolute top-0   z-10 shadow-black/80 border-r-[1px] border-pink-700  bg-gray-100 h-screen"
      [class.open]="isOpen()"
      (click)="onClick()">
      <div class=" w-56">
        <h2
          class="sticky top-0  right-0 left-0  h-12   bg-pink-700  flex items-center
           justify-start px-4  text-pink-100 text-lg ">
          <ng-content select="[drawer-title]"></ng-content>
        </h2>
        <div class="px-2">
          <ng-content> </ng-content>
        </div>
      </div>
    </div>
  `,
  host: {
    class: "",
  },
})
export class Drawer implements OnDestroy {
  protected isOpen = signal(false);

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
      this.removeDocumentClickListenerFn = this.renderer.listen("document", "click", () => this.hide());
      this.removeDocumentEscapeListenerFn = this.renderer.listen("document", "keydown.escape", () => this.hide(), {
        passive: true,
      });
    }
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentEscapeListenerFn?.();
  }
}
