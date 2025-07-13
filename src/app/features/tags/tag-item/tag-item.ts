import { Component, input } from "@angular/core";

@Component({
  selector: "pd-tag-item",
  imports: [],
  template: ` <a href="#"
    ><button
      class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background
       transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
       disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-2 py-2 w-full 
       justify-start">
      {{ label()
      }}<span
        class="ml-auto rounded-full bg-azul-400/70 w-6 h-6 text-white/90 text-xs flex flex-row items-center justify-center"
        >{{ cantidad() }}</span
      >
    </button></a
  >`,
  styles: ``,
})
export class TagItem {
  url = input("/imagenes/ilustracion");
  label = input("Ilustraciones");
  cantidad = input(1);
}
