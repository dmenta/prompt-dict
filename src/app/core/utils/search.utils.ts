/**
 * Utilidades para búsqueda y manipulación de texto
 */

/**
 * Normaliza un texto removiendo acentos y convirtiendo a lowercase
 * para hacer búsquedas accent-insensitive
 */
export function normalizeSearchText(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD") // Descompone caracteres con acentos
        .replace(/[\u0300-\u036f]/g, "") // Remueve los diacríticos
        .trim();
}

/**
 * Resalta texto dentro de un string más largo
 * Retorna las partes del texto con información de dónde está el highlight
 */
export interface TextHighlight {
    parts: string[];
    highlightIndex: number;
}

export function createTextHighlight(
    originalText: string,
    searchTerm: string,
    contextLength: number = 40
): TextHighlight {
    const normalizedText = normalizeSearchText(originalText);
    const normalizedSearch = normalizeSearchText(searchTerm);

    const position = normalizedText.indexOf(normalizedSearch);
    if (position === -1) {
        return {
            parts: [originalText.slice(0, contextLength)],
            highlightIndex: -1,
        };
    }

    const halfContext = Math.floor(contextLength / 2);
    const searchLength = searchTerm.length;

    // Determinar el rango a mostrar
    const start = Math.max(0, position - halfContext);
    const end = Math.min(originalText.length, position + searchLength + halfContext);

    // Ajustar si estamos al inicio o final del texto
    const actualStart = position <= halfContext ? 0 : start;
    const actualEnd = position + searchLength >= originalText.length - halfContext ? originalText.length : end;

    // Extraer las partes
    const beforeText = originalText.slice(actualStart, position);
    const highlightText = originalText.slice(position, position + searchLength);
    const afterText = originalText.slice(position + searchLength, actualEnd);

    const parts: string[] = [];
    let highlightIndex = -1;

    if (beforeText) {
        parts.push(beforeText);
        highlightIndex = parts.length; // El highlight será el siguiente
    } else {
        highlightIndex = 0; // El highlight será el primero
    }

    parts.push(highlightText);

    if (afterText) {
        parts.push(afterText);
    }

    return {
        parts,
        highlightIndex,
    };
}

/**
 * Algoritmo de búsqueda mejorado que soporta múltiples términos
 */
export function createSearchMatcher(searchTerms: string[]) {
    const normalizedTerms = searchTerms.map((term) => normalizeSearchText(term));

    return {
        /**
         * Busca todos los términos en un texto y retorna la mejor coincidencia
         */
        findBestMatch(text: string): { found: boolean; position: number; matchedTerm: string } {
            const normalizedText = normalizeSearchText(text);

            let bestMatch = { found: false, position: -1, matchedTerm: "" };
            let earliestPosition = text.length;

            for (const term of normalizedTerms) {
                const position = normalizedText.indexOf(term);
                if (position !== -1 && position < earliestPosition) {
                    earliestPosition = position;
                    bestMatch = {
                        found: true,
                        position,
                        matchedTerm: term,
                    };
                }
            }

            return bestMatch;
        },

        /**
         * Verifica si el texto contiene alguno de los términos
         */
        matches(text: string): boolean {
            const normalizedText = normalizeSearchText(text);
            return normalizedTerms.some((term) => normalizedText.includes(term));
        },
    };
}
