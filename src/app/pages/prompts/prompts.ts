import { Component, inject } from "@angular/core";
import { PromptsList } from "../../features/prompts/prompts-list/prompts-list";
import { PersistService } from "../../core/services/persist.service";

@Component({
  selector: "pd-prompts",
  imports: [PromptsList],
  template: `<pd-prompts-list [prompts]="todos()"></pd-prompts-list>`,
})
export class Prompts {
  persistService = inject(PersistService);

  todos = this.persistService.prompts;
}
