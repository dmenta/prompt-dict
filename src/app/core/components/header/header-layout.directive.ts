import { Directive, input, HostBinding, computed, signal } from "@angular/core";

/**
 * Directiva que combina múltiples comportamientos comunes para headers
 * Incluye sticky positioning, colores de fondo y z-index
 */
@Directive({
    selector: "[pdHeaderLayout]",
    host: {
        class: "sticky left-0 top-0 z-10 bg-header",
    },
})
export class HeaderLayoutDirective {
    // Permite customizar la altura del header
    @HostBinding("class")
    get height() {
        return this.actualHeight();
    }

    double = signal<boolean>(false);

    actualHeight = computed(() => (this.double() ? "h-30" : "h-14"));
}

@Directive({
    selector: "[pdDoubleHeaderLayout]",
})
export class DoubleHeaderLayoutDirective extends HeaderLayoutDirective {
    // Permite customizar la altura del header

    constructor() {
        super();
        this.double.set(true);
    }
}

/**
 * Directiva para el contenido principal del header
 */
@Directive({
    selector: "[pdHeaderContent]",
    host: {
        class: "px-3 flex flex-col justify-center gap-1 bg-header",
    },
})
export class HeaderContentDirective {}

/**
 * Directiva para la fila principal del header
 */
@Directive({
    selector: "[pdHeaderRow]",
    host: {
        class: "flex items-center overflow-hidden justify-between gap-2 h-14",
    },
})
export class HeaderRowDirective {}
