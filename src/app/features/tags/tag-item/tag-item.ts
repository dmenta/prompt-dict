import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "pd-tag-item",
  imports: [RouterLink, RouterLinkActive],
  template: ` <a
    [routerLink]="['./prompts']"
    [queryParams]="{ tag: slug() }"
    routerLinkActive
    #rla="routerLinkActive"
    class="select-none "
    ><button
      [disabled]="rla.isActive"
      class="inline-flex items-center whitespace-nowrap rounded-md font-medium ring-offset-background
      transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-2 py-2  w-full gap-2">
      <span
        class="rounded-full bg-azul-400/70   min-w-6  h-6 pb-0.5 text-white  flex flex-row items-center justify-center"
        >{{ cantidad() }}</span
      >
      <span class="lowercase first-letter:uppercase"> {{ text() }}</span>
    </button></a
  >`,
  styles: ``,
})
export class TagItem {
  slug = input<string | null>(null);
  text = input("");
  cantidad = input(0);
}
