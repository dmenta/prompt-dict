import { Timestamp } from "firebase/firestore";

export interface Prompt {
    id?: string;
    old_id?: number; // Para compatibilidad con IDs antiguos
    titulo: string;
    descripcion: string;
    autor: string;
    categoria: string;
    tags: string[];
    prompt: string;
    uso: "texto" | "código" | "imagen" | "video" | "audio" | "otro";
    idioma: string;
    fecha_creacion: Timestamp;
    slug: string;
    fecha_edicion?: Timestamp;
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

export type AddPrompt = Pick<
    Prompt,
    "titulo" | "descripcion" | "autor" | "categoria" | "tags" | "prompt" | "uso" | "idioma"
>;
