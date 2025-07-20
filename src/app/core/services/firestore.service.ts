import { Injectable, inject, signal } from "@angular/core";
import {
    Firestore,
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    DocumentData,
    QuerySnapshot,
    Timestamp,
} from "@angular/fire/firestore";
import { FirestorePrompt, FirestoreTag, FirestoreCategory } from "../models";
import { limit, startAt } from "firebase/firestore";

@Injectable({
    providedIn: "root",
})
export class FirestoreService {
    private firestore = inject(Firestore);

    // Collections references
    private promptsCollection = collection(this.firestore, "prompts");
    private categoriesCollection = collection(this.firestore, "categories");
    private tagsCollection = collection(this.firestore, "tags");

    private currCategories = signal([] as FirestoreCategory[]);
    private currTags = signal([] as FirestoreTag[]);
    private currPrompts = signal<FirestorePrompt[]>([]);

    public error = signal<string | null>(null);

    // ==================== PROMPTS ====================

    /**
     * Obtener todos los prompts
     */
    async getPrompts(): Promise<FirestorePrompt[]> {
        try {
            this.error.set(null);

            const curr = this.currPrompts();
            const lastId = curr.length === 0 ? 0 : curr[curr.length - 1].old_id;

            const querySnapshot = await getDocs(
                query(this.promptsCollection, orderBy("old_id", "asc"), startAt(lastId), limit(10))
            );
            const prompts = this.mapQuerySnapshotToPrompts(querySnapshot);
            console.log("Prompts obtenidos:", prompts, curr);
            this.currPrompts.set([...curr, ...prompts.slice(1)]);
            return this.currPrompts();
        } catch (error) {
            const errorMessage = `Error al obtener prompts: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Obtener un prompt por ID
     */
    async getPromptById(id: string): Promise<FirestorePrompt | null> {
        try {
            this.error.set(null);
            const q = query(this.promptsCollection, where("slug", "==", id));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }
            const docSnap = querySnapshot.docs[0];

            if (!docSnap.exists()) {
                return null;
            }
            return this.mapDocumentToPrompt(docSnap.id, docSnap.data());
        } catch (error) {
            const errorMessage = `Error al obtener prompt ${id}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return null;
        }
    }

    /**
     * Crear un nuevo prompt
     */
    async createPrompt(prompt: Omit<FirestorePrompt, "id">): Promise<string | null> {
        try {
            this.error.set(null);
            const promptData = {
                ...prompt,
                fecha_creacion: new Date(),
            };

            const docRef = await addDoc(this.promptsCollection, promptData);
            return docRef.id;
        } catch (error) {
            const errorMessage = `Error al crear prompt: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return null;
        }
    }

    /**
     * Actualizar un prompt
     */
    async updatePrompt(id: string, updates: Partial<FirestorePrompt>): Promise<boolean> {
        try {
            this.error.set(null);
            const docRef = doc(this.firestore, "prompts", id);
            await updateDoc(docRef, {
                ...updates,
                fechaModificacion: new Date(),
            });
            return true;
        } catch (error) {
            const errorMessage = `Error al actualizar prompt ${id}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return false;
        }
    }

    /**
     * Eliminar un prompt
     */
    async deletePrompt(id: string): Promise<boolean> {
        try {
            this.error.set(null);
            const docRef = doc(this.firestore, "prompts", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar prompt ${id}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return false;
        }
    }

    /**
     * Buscar prompts por texto
     */
    async searchPrompts(searchTerm: string): Promise<FirestorePrompt[]> {
        try {
            this.error.set(null);
            // Nota: Firestore no tiene búsqueda full-text nativa
            // Esta es una implementación básica. Para búsqueda avanzada considera usar Algolia o Elasticsearch

            const normalizedSearch = searchTerm.toLowerCase();
            const allPrompts = await this.getPrompts();

            return allPrompts.filter(
                (prompt) =>
                    prompt.titulo.toLowerCase().includes(normalizedSearch) ||
                    prompt.prompt.toLowerCase().includes(normalizedSearch) ||
                    prompt.descripcion.toLowerCase().includes(normalizedSearch) ||
                    prompt.categoria.toLowerCase().includes(normalizedSearch) ||
                    prompt.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
            );
        } catch (error) {
            const errorMessage = `Error en búsqueda: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Obtener prompts por categoría
     */
    async getPromptsByCategory(category: string): Promise<FirestorePrompt[]> {
        try {
            this.error.set(null);
            const q = query(this.promptsCollection, where("categoria", "==", category));
            const querySnapshot = await getDocs(q);
            return this.mapQuerySnapshotToPrompts(querySnapshot);
        } catch (error) {
            const errorMessage = `Error al obtener prompts por categoría: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Obtener prompts por tag
     */
    async getPromptsByTag(tag: string): Promise<FirestorePrompt[]> {
        try {
            this.error.set(null);
            const q = query(this.promptsCollection, where("tags", "array-contains", tag));
            const querySnapshot = await getDocs(q);
            return this.mapQuerySnapshotToPrompts(querySnapshot);
        } catch (error) {
            const errorMessage = `Error al obtener prompts por tag: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Obtener lista de categorias
     */
    async getCategories(): Promise<FirestoreCategory[]> {
        if (this.currCategories().length > 0) {
            return this.currCategories();
        }

        try {
            this.error.set(null);
            const q = query(this.categoriesCollection);
            const querySnapshot = await getDocs(q);
            const categories = this.mapQuerySnapshotToCategories(querySnapshot);
            this.currCategories.set(categories);

            return categories;
        } catch (error) {
            const errorMessage = `Error al obtener categorís: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Obtener lista de etiquetas
     */
    async getTags(): Promise<FirestoreTag[]> {
        if (this.currTags().length > 0) {
            return this.currTags();
        }

        try {
            this.error.set(null);
            const q = query(this.tagsCollection);
            const querySnapshot = await getDocs(q);
            const tags = this.mapQuerySnapshotToTags(querySnapshot);
            this.currTags.set(tags);

            return tags;
        } catch (error) {
            const errorMessage = `Error al obtener etiquetas: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Obtener un prompt por ID
     */
    async getCategoryBySlug(slug: string): Promise<FirestoreCategory | null> {
        try {
            this.error.set(null);
            const q = query(this.categoriesCollection, where("slug", "==", slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }
            const docSnap = querySnapshot.docs[0];

            if (!docSnap.exists()) {
                return null;
            }
            return this.mapDocumentToCategory(docSnap.id, docSnap.data());
        } catch (error) {
            const errorMessage = `Error al obtener category ${slug}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return null;
        }
    }

    async getTagBySlug(slug: string): Promise<FirestoreTag | null> {
        try {
            this.error.set(null);
            const q = query(this.tagsCollection, where("slug", "==", slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }
            const docSnap = querySnapshot.docs[0];

            if (!docSnap.exists()) {
                return null;
            }
            return this.mapDocumentToTag(docSnap.id, docSnap.data());
        } catch (error) {
            const errorMessage = `Error al obtener tag ${slug}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return null;
        }
    }

    // ==================== PRIVATE METHODS ====================

    /**
     * Mapear QuerySnapshot a array de Prompts
     */
    private mapQuerySnapshotToPrompts(
        querySnapshot: QuerySnapshot<DocumentData>
    ): FirestorePrompt[] {
        return querySnapshot.docs.map((doc) => this.mapDocumentToPrompt(doc.id, doc.data()));
    }

    /**
     * Mapear QuerySnapshot a array de Categories
     */
    private mapQuerySnapshotToCategories(
        querySnapshot: QuerySnapshot<DocumentData>
    ): FirestoreCategory[] {
        return querySnapshot.docs.map((doc) => this.mapDocumentToCategory(doc.id, doc.data()));
    }

    /**
     * Mapear QuerySnapshot a array de Tags
     */
    private mapQuerySnapshotToTags(querySnapshot: QuerySnapshot<DocumentData>): FirestoreTag[] {
        return querySnapshot.docs.map((doc) => this.mapDocumentToTag(doc.id, doc.data()));
    }

    /**
     * Mapear documento a Prompt
     */
    private mapDocumentToPrompt(id: string, data: DocumentData): FirestorePrompt {
        return {
            id: id,
            old_id: data["old_id"] ? parseInt(data["old_id"]) : undefined,
            titulo: data["titulo"] || "",
            prompt: data["prompt"] || "",
            descripcion: data["descripcion"] || "",
            autor: data["autor"] || "",
            categoria: data["categoria"] || "",
            tags: data["tags"] || [],
            uso: data["uso"] || "texto",
            idioma: data["idioma"] || "es-AR",
            fecha_creacion: (<Timestamp>data["fecha_creacion"])?.toDate() || new Date(),
            slug: data["slug"] || this.generateSlug(data["titulo"] || ""),
            fecha_edicion: (<Timestamp>data["fecha_edicion"])?.toDate() || new Date(),
            modelo: data["modelo"],
            ejemplo: data["ejemplo"],
            fuente: data["fuente"],
            referencias: data["referencias"],
            notas: data["notas"],
            estado: data["estado"],
            version: data["version"],
            comentarios: data["comentarios"],
            feedback: data["feedback"],
            rating: data["rating"],
            visibilidad: data["visibilidad"],
            licencia: data["licencia"],
        };
    }

    private mapDocumentToCategory(id: string, data: DocumentData): FirestoreCategory {
        return {
            id: id,
            name: data["name"] || "",
            slug: data["slug"] || this.generateSlug(data["name"] || ""),
            prompt_count: Number(data["prompt_count"]) || 0,
            fecha_creacion: (<Timestamp>data["fecha_creacion"])?.toDate() || new Date(),
        };
    }

    private mapDocumentToTag(id: string, data: DocumentData): FirestoreTag {
        return {
            id: id,
            name: data["name"] || "",
            slug: data["slug"] || this.generateSlug(data["name"] || ""),
            prompt_count: Number(data["prompt_count"]) || 0,
            fecha_creacion: (<Timestamp>data["fecha_creacion"])?.toDate() || new Date(),
        };
    }

    /**
     * Generar slug a partir de un título
     */
    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim();
    }
}
