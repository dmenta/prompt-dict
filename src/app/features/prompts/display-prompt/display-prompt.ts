import { Component, input, OnDestroy, OnInit, Renderer2, signal, ViewChild } from "@angular/core";
import { Prompt } from "../prompt";
import { CopyActions } from "../../../core/components/action-button/copy-actions/copy-actions";
import { fromEvent, Subscription } from "rxjs";

@Component({
  selector: "pd-display-prompt",
  imports: [CopyActions],

  template: `
    @if(prompt(); as promptOk) {
    <div id="contenedor" class="text-azul-500 px-4 text-xl font-semibold uppercase" style="text-wrap: balance">
      {{ promptOk.titulo }}
    </div>
    <div
      class="relative prompt w-full group-hover:opacity-100 text-black 
       transition-opacity duration-300 px-4 
        overflow-y-auto">
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
        [class.hidden]="!visible()"
        [promptText]="promptOk.prompt"
        [promptUrl]="promptOk.id ? this.baseUrl() + '/prompts/' + promptOk.id : null"
        class="absolute bottom-3 right-5  group-hover:block opacity-80 hover:opacity-100 
         transition-opacity"></pd-copy-actions>
    </div>
    } @else{
    <div class="no-prompt">No prompt available</div>
    }
  `,
  host: {
    class:
      "relative inline-block group px-2 py-4  shadow-md/40 shadow-black/60 hover:bg-gray-200 transition-colors duration-150",
  },
})
export class DisplayPrompt implements OnInit, OnDestroy {
  @ViewChild("#contenedor") container: HTMLDivElement | null = null;

  visible = signal(false);

  prompt = input<Prompt | null>(null);
  baseUrl = input<string>(window.location.origin);
  subscript: Subscription | null = null;

  ngOnInit() {
    console.log("DisplayPrompt initialized with prompt:", this.container);
    if ("ontouchstart" in window) {
      console.log("Touch device detected, enabling touch toggle for visibility");
      this.subscript = fromEvent(document, "touchstart", { passive: true }).subscribe((event) => {
        this.visible.set(!this.visible());
        (event as MouseEvent).stopPropagation();
      });
    }
  }

  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }
}
