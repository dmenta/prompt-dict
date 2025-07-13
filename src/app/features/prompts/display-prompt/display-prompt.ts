import { Component, input } from "@angular/core";
import { Prompt } from "../prompt";
import { CopyActions } from "../../../core/components/action-button/copy-actions/copy-actions";

@Component({
  selector: "pd-display-prompt",
  imports: [CopyActions],
  template: `
    @if(prompt(); as promptOk) {
    <div class="relative prompt w-full h-40  p-2 border border-gray-300 rounded-md shadow-sm overflow-y-auto">
      <div>{{ promptOk.titulo }}</div>
      <div>{{ promptOk.descripcion }}</div>
      <div class="category">Category: {{ promptOk.categoria }}</div>
      <div class="prompt-text">{{ promptOk.prompt }}</div>
      <div class="author">Author: {{ promptOk.autor }}</div>
      <div class="prompt-id">ID: {{ promptOk.id }}</div>

      <div class="tags">
        @for(tag of promptOk?.tags??[]; track tag) {
        <span class="tag">{{ tag }}</span>
        }
      </div>
    </div>
    } @else{
    <div class="no-prompt">No prompt available</div>
    }
    <pd-copy-actions class="absolute bottom-3 right-5 hidden group-hover:block"></pd-copy-actions>
  `,
  host: {
    class: "relative inline-block group ",
  },
})
export class DisplayPrompt {
  prompt = input<Prompt | null>(null);
}
