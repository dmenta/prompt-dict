import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TagsList } from "./core/tags-list/tags-list";

@Component({
  selector: "pd-root",
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet> `,
  styles: [],
})
export class App {
  protected title = "prompt-dict";
}
