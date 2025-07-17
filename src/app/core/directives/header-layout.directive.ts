import { Directive, input, HostBinding } from "@angular/core";

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
    @HostBinding("class.h-14")
    get isSingleHeight() {
        return !this.double();
    }

    @HostBinding("class.h-30")
    get isDoubleHeight() {
        return this.double();
    }

    double = input<boolean>(false);
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
        class: "flex items-center overflow-hidden justify-between gap-2",
    },
})
export class HeaderRowDirective {}
