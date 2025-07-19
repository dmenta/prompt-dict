export interface FirestorePrompt {
    id?: string;
    titulo: string;
    prompt: string;
    descripcion: string;
    autor: string;
    categoria: string;
    tags: string[];
    uso?: "texto" | "código" | "imagen" | "video" | "audio" | "otro";
    idioma?: string;
    fecha_creacion?: Date;
    slug?: string;
    fechaEdicion?: Date;
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
    fechaCreacion?: Date;
    fechaModificacion?: Date;
}

export interface FirestoreCategory {
    id?: string;
    name: string;
    slug: string;
    promptCount: number;
    createdAt?: Date;
}

export interface FirestoreTag {
    id?: string;
    name: string;
    slug: string;
    promptCount: number;
    createdAt?: Date;
}
