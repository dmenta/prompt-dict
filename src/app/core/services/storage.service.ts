import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    private readonly baseId = "prompt-dict";
    /**
     *
     * @param identifier
     * @param value
     * Saves a value to localStorage with the given identifier.
     * The value is stringified before saving.
     */
    public save<T>(identifier: string, value: NonNullable<T>) {
        localStorage.setItem(this.fullIdentifier(identifier), JSON.stringify(value));
    }

    /**
     *
     * @param identifier
     * Retrieves a value from localStorage by its identifier.
     * If the value is not found or cannot be parsed, it returns null.
     */
    public get<T>(identifier: string): T | null {
        const value = localStorage.getItem(this.fullIdentifier(identifier));
        if (value) {
            try {
                return JSON.parse(value) as T;
            } catch (e) {
                console.error(`Error parsing value for ${identifier}:`, e);
                return null;
            }
        }
        return null;
    }

    public delete(identifier: string): void {
        localStorage.removeItem(this.fullIdentifier(identifier));
    }

    private fullIdentifier(identifier: string): string {
        return `${this.baseId}-${identifier}`;
    }
}
