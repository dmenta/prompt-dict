import { Component, signal } from "@angular/core";
import { DisplayPrompt } from "../display-prompt/display-prompt";

@Component({
  selector: "pd-prompts-list",
  imports: [DisplayPrompt],
  template: `
    <div class="space-y-4  p-4 w-screen h-full flex flex-col overflow-y-auto">
      @for(item of prompts(); track item.id) {
      <pd-display-prompt [prompt]="item"></pd-display-prompt>
      }
    </div>
  `,
  styles: ``,
})
export class PromptsList {
  prompt = {
    id: "1",
    title: "Sample Prompt",
    description: "This is a sample prompt for demonstration purposes.",
    tags: ["example", "demo"],
  };

  prompts = signal([
    { id: 1, title: "Prompt 1", description: "Description for prompt 1", tags: ["tag1", "tag2"] },
    { id: 2, title: "Prompt 2", description: "Description for prompt 2", tags: ["tag3", "tag4"] },
    { id: 3, title: "Prompt 3", description: "Description for prompt 3", tags: ["tag5", "tag6"] },
    { id: 4, title: "Prompt 4", description: "Description for prompt 4", tags: ["tag7", "tag8"] },
    { id: 5, title: "Prompt 5", description: "Description for prompt 5", tags: ["tag9", "tag10"] },
    { id: 6, title: "Prompt 6", description: "Description for prompt 6", tags: ["tag11", "tag12"] },
    { id: 7, title: "Prompt 7", description: "Description for prompt 7", tags: ["tag13", "tag14"] },
    { id: 8, title: "Prompt 8", description: "Description for prompt 8", tags: ["tag15", "tag16"] },
    { id: 9, title: "Prompt 9", description: "Description for prompt 9", tags: ["tag17", "tag18"] },
    { id: 10, title: "Prompt 10", description: "Description for prompt 10", tags: ["tag19", "tag20"] },
    { id: 11, title: "Prompt 11", description: "Description for prompt 11", tags: ["tag21", "tag22"] },
    { id: 12, title: "Prompt 12", description: "Description for prompt 12", tags: ["tag23", "tag24"] },
  ]);
}
