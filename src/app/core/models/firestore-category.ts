import { Timestamp } from "firebase/firestore";

export interface FirestoreCategory {
    id?: string;
    name: string;
    slug: string;
    prompt_count: number;
    fecha_creacion?: Timestamp;
}
