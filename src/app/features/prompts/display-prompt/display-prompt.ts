import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from "@angular/core";
import { Prompt } from "../prompt";
import { CopyActions } from "../../../core/components/action-button/copy-actions/copy-actions";
import { fromEvent, Subscription } from "rxjs";

@Component({
  selector: "pd-display-prompt",
  imports: [CopyActions],

  template: `
    @if(prompt(); as promptOk) {
    <div class="text-azul-500  px-4 text-xl font-semibold uppercase" style="text-wrap: balance">
      {{ promptOk.titulo }}
    </div>
    <div
      class="relative prompt w-full group-hover:opacity-100 text-black 
      transition-opacity duration-300 px-4 ">
      <!-- <div class="prompt-id">ID: {{ promptOk.id }}</div> -->
      <!-- <div class="category">Category: {{ promptOk.categoria }}</div> -->
      <div class="prompt-text font-merri py-6 text-lg/8 italic">{{ promptOk.prompt }}</div>
      <div>{{ promptOk.descripcion }}</div>
      <!-- <div class="author">Author: {{ promptOk.autor }}</div> -->

      <!-- <div class="tags flex flex-wrap gap-1 mt-4 lowercase">
        @for(tag of promptOk?.tags??[]; track tag) {
          <span class="tag bg-gray-300">{{ tag }}</span>
        }
      </div> -->
      <pd-copy-actions
        class="absolute bottom-3 right-5  opacity-70 hidden z-3 group-active:block group-hover:block group-focus:block  focus:block hover:opacity-100
      transition-opacity"
        tabindex="2"
        [promptText]="promptOk.prompt"
        [promptUrl]="promptOk.id ? this.baseUrl() + '/prompts/' + promptOk.id : null"></pd-copy-actions>
    </div>
    } @else{
    <div class="no-prompt">No prompt available</div>
    }
    <div
      tabindex="2"
      class="absolute bg-transparent top-0 right-0 bottom-0 left-0 z-2 focus:hidden  group-focus:block hidden"></div>
  `,
  host: {
    class:
      "relative inline-block group px-2 py-4  shadow-md/40 shadow-black/60 hover:bg-gray-200 transition-colors duration-150",
  },
})
export class DisplayPrompt {
  visible = signal(false);

  prompt = input<Prompt | null>(null);
  baseUrl = input<string>(window.location.origin);
}
