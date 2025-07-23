import { Timestamp } from "firebase/firestore";

export interface FirestoreTag {
    id?: string;
    name: string;
    slug: string;
    prompt_count: number;
    fecha_creacion?: Timestamp;
}
