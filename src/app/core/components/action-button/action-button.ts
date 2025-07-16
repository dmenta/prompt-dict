import { Component, output } from "@angular/core";

@Component({
  selector: "pd-action-button",
  imports: [],
  template: `<button
    #pdbutton
    (click)="onClick($event)"
    class="action-button shadow-md/80 rounded-full shadow-black/60  text-action-contrast bg-action
    active:scale-95 transition-transform duration-100
     w-10 h-10 flex items-center  justify-center">
    <ng-content></ng-content>
  </button> `,
  host: {
    class: "inline-block",
  },
})
export class ActionButton {
  clicked = output<MouseEvent | TouchEvent>();

  onClick(event: MouseEvent) {
    this.clicked.emit(event);
  }
}
