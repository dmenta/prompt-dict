import { Component, input, model, signal } from "@angular/core";

@Component({
  selector: "pd-drawer",
  imports: [],
  template: `
    <div
      class="drawer  shadow-lg  absolute top-0   shadow-black/60 border-r-[1px] border-pink-700  bg-gray-100 h-screen block"
      [class.open]="isOpen()"
      (click)="onToggle()">
      <div class=" w-48">
        <h2
          class="sticky top-0  right-0 left-0  h-12   bg-pink-700  flex items-center
           justify-start px-4  text-pink-100 text-lg ">
          <ng-content select="[drawer-title]"></ng-content>
        </h2>
        <div class="px-2">
          <ng-content select="[drawer-content]"> </ng-content>
        </div>
      </div>
    </div>
  `,
  host: {
    class: "",
  },
})
export class Drawer {
  isOpen = model(false);

  onToggle() {
    this.isOpen.set(!this.isOpen());
  }
}
