/**
 * Cache para resultados de búsqueda frecuentes
 */
export class SearchCache {
    private cache = new Map<string, any>();
    private maxSize = 50;
    private accessOrder = new Set<string>();

    get(key: string): any | undefined {
        if (this.cache.has(key)) {
            // Marcar como recientemente usado
            this.accessOrder.delete(key);
            this.accessOrder.add(key);
            return this.cache.get(key);
        }
        return undefined;
    }

    set(key: string, value: any): void {
        // Si ya existe, actualizar orden de acceso
        if (this.cache.has(key)) {
            this.accessOrder.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remover el menos recientemente usado
            const oldestKey = this.accessOrder.values().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
                this.accessOrder.delete(oldestKey);
            }
        }

        this.cache.set(key, value);
        this.accessOrder.add(key);
    }

    clear(): void {
        this.cache.clear();
        this.accessOrder.clear();
    }
}

/**
 * Debouncer para evitar búsquedas excesivas
 */
export function createSearchDebouncer(delay: number = 300) {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function <T extends any[]>(fn: (...args: T) => void, ...args: T): void {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
