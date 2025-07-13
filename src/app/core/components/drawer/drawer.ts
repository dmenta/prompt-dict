import { Component, OnDestroy, Renderer2, signal } from "@angular/core";

@Component({
  selector: "pd-drawer",
  imports: [],
  template: `
    <div
      class="drawer  shadow-lg/60   absolute top-0   z-10 shadow-black/80 border-r-[1px] border-pink-700  bg-gray-100 h-screen overflow-hidden"
      [class.open]="isOpen()"
      (click)="onClick()">
      <h5
        class=" bg-gray-300 absolute  top-0  left-0 w-64 h-12 z-20  flex items-center
      justify-start pl-6 pr-8">
        <ng-content select="[drawer-title]"></ng-content>
      </h5>
      <div class=" w-64 absolute top-12 bottom-0 overflow-x-hidden overflow-y-auto">
        <div class="px-2  pt-4 h-full">
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
