import { Component, ElementRef, OnDestroy, OnInit, output, ViewChild } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";

@Component({
  selector: "pd-action-button",
  imports: [],
  template: `<button
    #pdbutton
    (click)="onClick($event)"
    class="action-button shadow-md/80 rounded-full shadow-black/60  text-white bg-azul-500 
    active:scale-95 transition-transform duration-100
     w-10 h-10 flex items-center justify-center">
    <ng-content></ng-content>
  </button> `,
  host: {
    class: "inline-block",
  },
})
export class ActionButton implements OnInit, OnDestroy {
  subscript: Subscription | null = null;
  @ViewChild("pdbutton") pdbutton: HTMLButtonElement | null = null;
  clicked = output<MouseEvent>();

  ngOnInit() {
    if (window.ontouchstart && this.pdbutton) {
      this.subscript = fromEvent(this.pdbutton, "touchstart", { passive: true }).subscribe((event) => {
        console.log("Touch event detected");
        this.clicked.emit(event as MouseEvent);
      });
    }
  }

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }

  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }
}
