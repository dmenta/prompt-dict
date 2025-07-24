import { Timestamp } from "firebase/firestore";

export interface Category {
    id?: string;
    name: string;
    slug: string;
    prompt_count: number;
    fecha_creacion?: Timestamp;
}
