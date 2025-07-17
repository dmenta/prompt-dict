import { Directive, input, computed, effect, ElementRef, inject } from "@angular/core";

export type IconType = "menu" | "back" | "search" | "copy" | "share" | "dark-mode" | "light-mode" | "close";

const ICON_PATHS: Record<IconType, string> = {
    menu: "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z",
    back: "m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z",
    search: "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
    copy: "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z",
    share: "M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z",
    "dark-mode":
        "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z",
    "light-mode":
        "M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80Z",
    close: "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z",
};

@Directive({
    selector: "[pdIcon]",
    host: {
        "[innerHTML]": "svgContent()",
    },
})
export class IconDirective {
    private elementRef = inject(ElementRef);

    icon = input.required<IconType>({ alias: "pdIcon" });
    size = input<number>(24);
    fill = input<string>("currentColor");

    svgContent = computed(() => {
        const iconPath = ICON_PATHS[this.icon()];
        if (!iconPath) {
            console.warn(`Icon "${this.icon()}" not found`);
            return "";
        }

        return `
            <svg height="${this.size()}px" viewBox="0 -960 960 960" width="${this.size()}px" fill="${this.fill()}">
                <path d="${iconPath}" />
            </svg>
        `;
    });

    constructor() {
        effect(() => {
            // Ensure the host element has proper display properties for SVG
            this.elementRef.nativeElement.style.display = "inline-block";
            this.elementRef.nativeElement.style.lineHeight = "0";
        });
    }
}
