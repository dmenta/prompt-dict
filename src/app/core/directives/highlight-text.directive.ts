import { Directive, input, computed } from "@angular/core";

export interface TextPart {
    parts: string[];
    in: number;
}

@Directive({
    selector: "[pdHighlightText]",
    host: {
        "[class.text-lg]": "true",
        "[class.whitespace-pre]": "true",
        "[class.dark:bg-[#FFFF0060]]": "isHighlighted()",
        "[class.bg-[#FFFF00]]": "isHighlighted()",
    },
})
export class HighlightTextDirective {
    textData = input.required<TextPart>({ alias: "pdHighlightText" });
    partIndex = input.required<number>();

    isHighlighted = computed(() => this.partIndex() === this.textData().in);
}
