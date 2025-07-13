import { Component, input } from "@angular/core";
import { Prompt } from "../prompt";

@Component({
  selector: "pd-display-prompt",
  imports: [],
  template: `
    @if(prompt(); as promptOk) {
    <div class="prompt w-full h-40  p-2 border border-gray-300 rounded-md shadow-sm overflow-y-auto">
      <div>{{ promptOk.titulo }}</div>
      <div>{{ promptOk.descripcion }}</div>
      <div class="category">Category: {{ promptOk.categoria }}</div>
      <div class="prompt-text">{{ promptOk.prompt }}</div>
      <div class="author">Author: {{ promptOk.autor }}</div>

      <div class="tags">
        @for(tag of promptOk?.tags??[]; track tag) {
        <span class="tag">{{ tag }}</span>
        } @empty {
        <span class="tag empty">No tags</span>
        }
        <div class="tag-count">{{ promptOk.tags.length }} tags</div>
        <div class="prompt-id">ID: {{ promptOk.id }}</div>
      </div>
    </div>
    } @else{
    <div class="no-prompt">No prompt available</div>
    }
  `,
  styles: ``,
})
export class DisplayPrompt {
  prompt = input<Prompt | null>(null);
}
