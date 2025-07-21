import { Directive, input, ElementRef, inject, Renderer2, effect } from "@angular/core";

type IconType =
    | "menu"
    | "back"
    | "search"
    | "copy"
    | "share"
    | "dark-mode"
    | "light-mode"
    | "close"
    | "link"
    | "terminal"
    | "check"
    | "add"
    | "delete";

const ICON_PATHS: Record<IconType, string> = {
    menu: "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z",
    back: "m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z",
    search: "M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z",
    copy: "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z",
    share: "M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z",
    "dark-mode":
        "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z",
    "light-mode":
        "M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z",
    close: "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z",
    link: "M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z",
    terminal:
        "M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z",
    check: "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z",
    add: "M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z",
    delete: "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z",
};

@Directive({
    selector: "[pdIcon]",
})
export class IconDirective {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);

    icon = input.required<IconType>({ alias: "pdIcon" });
    size = input<number>(24);
    fill = input<string>("currentColor");

    constructor() {
        effect(() => {
            this.createSvgIcon();
        });
    }

    private createSvgIcon(): void {
        const iconPath = ICON_PATHS[this.icon()];
        if (!iconPath) {
            // Clear any existing content

            console.warn(`Icon "${this.icon()}" not found`);
            return;
        }

        this.elementRef.nativeElement.innerHTML = "";

        // Create SVG element
        const svg = this.renderer.createElement("svg", "http://www.w3.org/2000/svg");
        this.renderer.setAttribute(svg, "height", `${this.size()}px`);
        this.renderer.setAttribute(svg, "width", `${this.size()}px`);
        this.renderer.setAttribute(svg, "viewBox", "0 -960 960 960");
        this.renderer.setAttribute(svg, "fill", this.fill());

        // Create path element
        const path = this.renderer.createElement("path", "http://www.w3.org/2000/svg");
        this.renderer.setAttribute(path, "d", iconPath);

        // Append path to SVG and SVG to host element
        this.renderer.appendChild(svg, path);
        this.renderer.appendChild(this.elementRef.nativeElement, svg);
    }
}
