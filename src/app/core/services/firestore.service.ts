import { Injectable, inject, signal } from "@angular/core";
import {
    Firestore,
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
    DocumentData,
    QuerySnapshot,
    onSnapshot,
    Unsubscribe,
} from "@angular/fire/firestore";
import { FirestorePrompt, FirestoreCategory, FirestoreTag } from "./firestore.types";
import { Prompt } from "../../features/prompts/prompt";
import { Observable, from } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class FirestoreService {
    private firestore = inject(Firestore);

    // Collections references
    private promptsCollection = collection(this.firestore, "prompts");
    private categoriesCollection = collection(this.firestore, "categories");
    private tagsCollection = collection(this.firestore, "tags");

    // Signals para reactive data
    public prompts = signal<Prompt[]>([]);
    public categories = signal<FirestoreCategory[]>([]);
    public tags = signal<FirestoreTag[]>([]);
    public isLoading = signal(false);
    public error = signal<string | null>(null);

    constructor() {
        this.initializeRealtimeListeners();
    }

    // ==================== PROMPTS ====================

    /**
     * Obtener todos los prompts
     */
    async getPrompts(): Promise<Prompt[]> {
        try {
            this.isLoading.set(true);
            this.error.set(null);

            const querySnapshot = await getDocs(
                query(this.promptsCollection, orderBy("fechaCreacion", "desc"))
            );
            const prompts = this.mapQuerySnapshotToPrompts(querySnapshot);

            this.prompts.set(prompts);
            return prompts;
        } catch (error) {
            const errorMessage = `Error al obtener prompts: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Obtener un prompt por ID
     */
    async getPromptById(id: string): Promise<Prompt | null> {
        try {
            this.error.set(null);
            const docRef = doc(this.firestore, "prompts", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return this.mapDocumentToPrompt(docSnap.id, docSnap.data());
            }
            return null;
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
                fechaCreacion: new Date(),
                fechaModificacion: new Date(),
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
    async searchPrompts(searchTerm: string): Promise<Prompt[]> {
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
    async getPromptsByCategory(category: string): Promise<Prompt[]> {
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
    async getPromptsByTag(tag: string): Promise<Prompt[]> {
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

    // ==================== SYNC METHODS ====================

    /**
     * Migrar datos locales a Firestore (usar solo una vez)
     */
    async migrateLocalData(localPrompts: Prompt[]): Promise<boolean> {
        try {
            this.isLoading.set(true);
            this.error.set(null);

            console.log(`Iniciando migración de ${localPrompts.length} prompts...`);

            const promises = localPrompts.map((prompt) => {
                const firestorePrompt: Omit<FirestorePrompt, "id"> = {
                    titulo: prompt.titulo,
                    prompt: prompt.prompt,
                    descripcion: prompt.descripcion,
                    autor: prompt.autor,
                    categoria: prompt.categoria,
                    tags: prompt.tags,
                    fechaCreacion: new Date(),
                    fechaModificacion: new Date(),
                };
                return addDoc(this.promptsCollection, firestorePrompt);
            });

            await Promise.all(promises);
            console.log("Migración completada exitosamente");
            return true;
        } catch (error) {
            const errorMessage = `Error en migración: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return false;
        } finally {
            this.isLoading.set(false);
        }
    }

    // ==================== PRIVATE METHODS ====================

    /**
     * Configurar listeners en tiempo real
     */
    private initializeRealtimeListeners(): void {
        // Listener para prompts
        onSnapshot(
            query(this.promptsCollection, orderBy("fechaCreacion", "desc")),
            (snapshot) => {
                const prompts = this.mapQuerySnapshotToPrompts(snapshot);
                this.prompts.set(prompts);
            },
            (error) => {
                console.error("Error en listener de prompts:", error);
                this.error.set(`Error en sincronización: ${error}`);
            }
        );
    }

    /**
     * Mapear QuerySnapshot a array de Prompts
     */
    private mapQuerySnapshotToPrompts(querySnapshot: QuerySnapshot<DocumentData>): Prompt[] {
        return querySnapshot.docs.map((doc) => this.mapDocumentToPrompt(doc.id, doc.data()));
    }

    /**
     * Mapear documento a Prompt
     */
    private mapDocumentToPrompt(id: string, data: DocumentData): Prompt {
        return {
            id: parseInt(id) || Math.random(), // Temporal - en Firestore usarás string IDs
            titulo: data["titulo"] || "",
            prompt: data["prompt"] || "",
            descripcion: data["descripcion"] || "",
            autor: data["autor"] || "",
            categoria: data["categoria"] || "",
            tags: data["tags"] || [],
            uso: data["uso"] || "texto",
            idioma: data["idioma"] || "es",
            fecha_creacion: data["fecha_creacion"] || data["fechaCreacion"] || new Date(),
            slug: data["slug"] || this.generateSlug(data["titulo"] || ""),
            fechaEdicion: data["fechaEdicion"] || data["fechaModificacion"],
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
