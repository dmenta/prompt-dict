export interface FirestorePrompt {
    id: number;
    old_id?: number; // Para compatibilidad con IDs antiguos
    titulo: string;
    descripcion: string;
    autor: string;
    categoria: string;
    tags: string[];
    prompt: string;
    uso: "texto" | "código" | "imagen" | "video" | "audio" | "otro";
    idioma: string;
    fecha_creacion: Date;
    slug: string;
    fecha_edicion?: Date;
    modelo?: string;
    ejemplo?: string;
    fuente?: string;
    referencias?: string[];
    notas?: string;
    estado?: string;
    version?: number;
    comentarios?: string[];
    feedback?: string;
    rating?: 1 | 2 | 3 | 4 | 5;
    visibilidad?: string;
    licencia?: string;
    // Campos adicionales para Firestore
}

export interface FirestoreCategory {
    id?: string;
    name: string;
    slug: string;
    prompt_count: number;
    fecha_creacion?: Date;
}

export interface FirestoreTag {
    id?: string;
    name: string;
    slug: string;
    prompt_count: number;
    fecha_creacion?: Date;
}
