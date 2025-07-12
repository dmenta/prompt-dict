import { Component, input } from "@angular/core";

@Component({
  selector: "pd-display-prompt",
  imports: [],
  template: `
    @if(prompt(); as promptOk) {
    <div class="prompt w-full h-48  p-2 border border-gray-300 rounded-md shadow-sm">
      <div>{{ promptOk.title }}</div>
      <div>{{ promptOk.description }}</div>
      <div class="tags">
        @for(tag of promptOk.tags; track tag) {
        <span class="tag">{{ tag }}</span>
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
  prompt = input<{
    id: number;
    title: string;
    description: string;
    tags: string[];
  } | null>(null);
}
