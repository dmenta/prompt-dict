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
 * Calcula la distancia de Levenshtein entre dos strings
 * Útil para fuzzy search
 */
export function levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
        matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + indicator // substitution
            );
        }
    }

    return matrix[str2.length][str1.length];
}

/**
 * Calcula un score de similitud fuzzy entre dos strings
 * Retorna un valor entre 0 (sin similitud) y 1 (coincidencia exacta)
 */
export function fuzzyMatchScore(searchTerm: string, target: string): number {
    const normalizedSearch = normalizeSearchText(searchTerm);
    const normalizedTarget = normalizeSearchText(target);

    // Coincidencia exacta
    if (normalizedTarget.includes(normalizedSearch)) {
        return 1.0;
    }

    // Si el término de búsqueda es muy corto, ser más estricto
    if (normalizedSearch.length < 3) {
        return normalizedTarget.startsWith(normalizedSearch) ? 0.8 : 0;
    }

    // Calcular distancia de Levenshtein
    const distance = levenshteinDistance(normalizedSearch, normalizedTarget);
    const maxLength = Math.max(normalizedSearch.length, normalizedTarget.length);

    // Convertir distancia a score de similitud
    const similarity = 1 - distance / maxLength;

    // Solo considerar como match si la similitud es alta
    return similarity >= 0.6 ? similarity : 0;
}

/**
 * Busca coincidencias fuzzy en un texto
 */
export function findFuzzyMatches(
    searchTerm: string,
    text: string,
    threshold: number = 0.6
): { score: number; position: number } | null {
    const words = text.split(/\s+/);
    let bestMatch: { score: number; position: number } | null = null;
    let currentPosition = 0;

    for (const word of words) {
        const score = fuzzyMatchScore(searchTerm, word);
        if (score >= threshold && (!bestMatch || score > bestMatch.score)) {
            bestMatch = { score, position: currentPosition };
        }
        currentPosition += word.length + 1; // +1 for space
    }

    return bestMatch;
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
    const actualEnd =
        position + searchLength >= originalText.length - halfContext ? originalText.length : end;

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
 * Algoritmo de búsqueda mejorado que soporta múltiples términos y fuzzy search
 */
export function createSearchMatcher(searchTerms: string[], enableFuzzy: boolean = true) {
    const normalizedTerms = searchTerms.map((term) => normalizeSearchText(term));

    return {
        /**
         * Busca todos los términos en un texto y retorna la mejor coincidencia
         */
        findBestMatch(text: string): {
            found: boolean;
            position: number;
            matchedTerm: string;
            isFuzzy: boolean;
            score: number;
        } {
            const normalizedText = normalizeSearchText(text);

            let bestMatch = {
                found: false,
                position: -1,
                matchedTerm: "",
                isFuzzy: false,
                score: 0,
            };
            let earliestPosition = text.length;

            // Primero buscar coincidencias exactas
            for (const term of normalizedTerms) {
                const position = normalizedText.indexOf(term);
                if (position !== -1 && position < earliestPosition) {
                    earliestPosition = position;
                    bestMatch = {
                        found: true,
                        position,
                        matchedTerm: term,
                        isFuzzy: false,
                        score: 1.0,
                    };
                }
            }

            // Si no hay coincidencias exactas y fuzzy está habilitado, buscar fuzzy matches
            if (!bestMatch.found && enableFuzzy) {
                for (const term of normalizedTerms) {
                    const fuzzyMatch = findFuzzyMatches(term, text);
                    if (fuzzyMatch && fuzzyMatch.score > bestMatch.score) {
                        bestMatch = {
                            found: true,
                            position: fuzzyMatch.position,
                            matchedTerm: term,
                            isFuzzy: true,
                            score: fuzzyMatch.score,
                        };
                    }
                }
            }

            return bestMatch;
        },

        /**
         * Verifica si el texto contiene alguno de los términos
         */
        matches(text: string): boolean {
            const normalizedText = normalizeSearchText(text);

            // Primero buscar coincidencias exactas
            const hasExactMatch = normalizedTerms.some((term) => normalizedText.includes(term));
            if (hasExactMatch) return true;

            // Si no hay coincidencias exactas y fuzzy está habilitado
            if (enableFuzzy) {
                return normalizedTerms.some((term) => {
                    const fuzzyMatch = findFuzzyMatches(term, text);
                    return fuzzyMatch && fuzzyMatch.score >= 0.7; // Threshold más alto para matches
                });
            }

            return false;
        },
    };
}
