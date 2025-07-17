import { Component, input } from "@angular/core";
import { HighlightTextDirective, TextPart } from "../../directives/highlight-text.directive";

@Component({
    selector: "pd-highlighted-text",
    imports: [HighlightTextDirective],
    template: `
        <div class="whitespace-nowrap flex flex-row justify-start items-center">
            @for (part of textData().parts; track $index; let i = $index) {
            <span [pdHighlightText]="textData()" [partIndex]="i">
                {{ part }}
            </span>
            }
        </div>
    `,
})
export class HighlightedTextComponent {
    textData = input.required<TextPart>();
}
