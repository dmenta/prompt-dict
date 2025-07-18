import { Directive, input, computed } from "@angular/core";

export interface TextPart {
    parts: string[];
    in: number;
}

@Directive({
    selector: "[pdHighlightText]",
    host: {
        class: "whitespace-pre",
        "[class.bg-resaltador]": "isHighlighted()",
    },
})
export class HighlightTextDirective {
    textData = input.required<TextPart>({ alias: "pdHighlightText" });
    partIndex = input.required<number>();

    isHighlighted = computed(() => this.partIndex() === this.textData().in);
}
