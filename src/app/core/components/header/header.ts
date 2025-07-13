import { Component, model, output, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "pd-header",
  imports: [],
  template: ` <div
    class="sticky top-0  right-0 left-0  h-12   bg-pink-600  flex items-center
           justify-start px-2 gap-2  text-pink-100 text-lg shadow-md/30 dark:shadow-black/20">
    <button
      (click)="open.emit(); $event.stopPropagation()"
      class="h-10 w-10 flex items-center justify-center rounded-md hover:bg-pink-500  transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </button>
    <h1 class="truncate" [title]="title.getTitle()">{{ this.title.getTitle() }}</h1>
  </div>`,
})
export class Header {
  open = output<void>();

  titulo = signal<string>("");

  constructor(public title: Title) {}

  ngOnInit() {
    this.titulo.set(this.title.getTitle());
  }
}
