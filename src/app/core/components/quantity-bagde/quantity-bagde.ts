import { Component, input } from "@angular/core";

@Component({
  selector: "pd-quantity-bagde",
  imports: [],
  template: ` <span>{{ quantity() }}</span> `,
  host: {
    class:
      "min-w-6  w-6 h-6 inline-flex items-center justify-center rounded-full dark:bg-gray-900 dark:text-gray-200 bg-azul-400/70 text-white text-xs",
  },
})
export class QuantityBagde {
  quantity = input<number>(0);
}
