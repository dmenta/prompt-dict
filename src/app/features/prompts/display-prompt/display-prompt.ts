import { Component, input, OnDestroy, OnInit, Renderer2, signal } from "@angular/core";
import { Prompt } from "../prompt";
import { CopyActions } from "../../../core/components/action-button/copy-actions/copy-actions";
import { fromEvent, Subscription } from "rxjs";

@Component({
  selector: "pd-display-prompt",
  imports: [CopyActions],

  template: `
    @if(prompt(); as promptOk) {
    <div>{{ promptOk.titulo }}</div>
    <div
      class="relative prompt w-full   opacity-70 group-hover:opacity-100 text-black  transition-opacity duration-300 p-2 border border-gray-300 rounded-md shadow-sm overflow-y-auto">
      <div class="prompt-id">ID: {{ promptOk.id }}</div>
      <div>{{ promptOk.descripcion }}</div>
      <!-- <div class="category">Category: {{ promptOk.categoria }}</div> -->
      <div class="prompt-text font-merri  text-lg/8 italic">{{ promptOk.prompt }}</div>
      <div class="author">Author: {{ promptOk.autor }}</div>

      <!-- <div class="tags">
        @for(tag of promptOk?.tags??[]; track tag) {
        <span class="tag">{{ tag }}</span>
        }
      </div> -->
      <pd-copy-actions
        [class.hidden]="!visible()"
        [promptText]="promptOk.prompt"
        [promptUrl]="promptOk.id ? this.baseUrl() + '/prompts/' + promptOk.id : null"
        class="absolute bottom-3 right-5  group-hover:block opacity-80 hover:opacity-100  transition-opacity"></pd-copy-actions>
    </div>
    } @else{
    <div class="no-prompt">No prompt available</div>
    }
  `,
  host: {
    class:
      "relative inline-block group p-2 bg-gray-200 rounded-md shadow-sm hover:bg-gray-200 transition-colors duration-150",
  },
})
export class DisplayPrompt implements OnInit, OnDestroy {
  visible = signal(false);

  prompt = input<Prompt | null>(null);
  baseUrl = input<string>(window.location.origin);
  subscript: Subscription | null = null;

  ngOnInit() {
    if ("ontouchstart" in window) {
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
