import { Component } from "@angular/core";

@Component({
  selector: "pd-action-button",
  imports: [],
  template: `<button
    class="action-button shadow-md/80 rounded-full shadow-black/60  text-white bg-azul-500 
    active:scale-95 transition-transform duration-100
     w-10 h-10 flex items-center justify-center">
    <ng-content></ng-content>
  </button> `,
  host: {
    class: "inline-block",
  },
})
export class ActionButton {}
