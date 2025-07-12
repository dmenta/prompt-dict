import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "pd-root",
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{ title }}!</h1>

    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected title = "prompt-dict";
}
