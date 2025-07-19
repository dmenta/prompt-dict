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
    onSnapshot,
    Timestamp,
} from "@angular/fire/firestore";
import { FirestorePrompt, FirestoreCategory, FirestoreTag } from "./firestore.types";
import { Prompt } from "../../features/prompts/prompt";

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
                query(this.promptsCollection, orderBy("fecha_creacion", "desc"))
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
    // ==================== SYNC METHODS ====================

    /**
     * Migrar datos locales a Firestore (usar solo una vez)
     */
    async migrateLocalData(localPrompts: Prompt[]): Promise<boolean> {
        try {
            this.isLoading.set(true);
            this.error.set(null);

            // console.log(`Iniciando migración de ${localPrompts.length} prompts...`);

            // const promises = localPrompts.map((prompt) => {
            //     const firestorePrompt: Omit<FirestorePrompt, "id"> = {
            //         old_id: prompt.id,
            //         titulo: prompt.titulo,
            //         prompt: prompt.prompt,
            //         descripcion: prompt.descripcion,
            //         autor: prompt.autor,
            //         categoria: prompt.categoria,
            //         tags: prompt.tags,
            //         uso: prompt.uso,
            //         idioma: prompt.idioma,
            //         fecha_creacion: new Date(prompt.fecha_creacion),
            //         slug: prompt.slug,
            //     };
            //     return addDoc(this.promptsCollection, firestorePrompt);
            // });

            const categorias = [] as {
                name: string;
                slug: string;
                fecha_creacion: Date;
                prompt_count: number;
            }[];
            localPrompts.forEach((prompt) => {
                const name = prompt.categoria.toLowerCase();
                const previa = categorias.find((c) => c.name === name);
                if (previa) {
                    previa.prompt_count++;
                    return;
                }
                const categoria = {
                    name,
                    slug: this.generateSlug(name),
                    fecha_creacion: new Date(),
                    prompt_count: 1, // Inicialmente 0, se actualizará después
                };
                categorias.push(categoria);
            });

            const catPromises = categorias.map((categorias) => {
                const firestoreCategory: Omit<FirestoreCategory, "id"> = {
                    name: categorias.name,
                    slug: categorias.slug,
                    fecha_creacion: categorias.fecha_creacion,
                    prompt_count: categorias.prompt_count,
                };
                return addDoc(this.categoriesCollection, firestoreCategory);
            });

            await Promise.all(catPromises);

            const tags = [] as {
                name: string;
                slug: string;
                fecha_creacion: Date;
                prompt_count: number;
            }[];
            localPrompts.forEach((prompt) => {
                prompt.tags.forEach((or_tag) => {
                    const name = or_tag.toLowerCase();
                    const previa = tags.find((c) => c.name === name);
                    if (previa) {
                        previa.prompt_count++;
                        return;
                    }
                    const tag = {
                        name,
                        slug: this.generateSlug(name),
                        fecha_creacion: new Date(),
                        prompt_count: 1, // Inicialmente 0, se actualizará después
                    };
                    tags.push(tag);
                });
            });

            const tagPromises = tags.map((tag) => {
                const firestoreTag: Omit<FirestoreTag, "id"> = {
                    name: tag.name,
                    slug: tag.slug,
                    fecha_creacion: tag.fecha_creacion,
                    prompt_count: tag.prompt_count,
                };
                return addDoc(this.tagsCollection, firestoreTag);
            });

            await Promise.all(tagPromises);
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
            query(this.promptsCollection, orderBy("fecha_creacion", "desc")),
            (snapshot) => {
                const prompts = this.mapQuerySnapshotToPrompts(snapshot);
                this.prompts.set(prompts);
            },
            (error) => {
                console.error("Error en listener de prompts:", error);
                this.error.set(`Error en sincronización: ${error}`);
            }
        );

        onSnapshot(
            query(this.categoriesCollection, orderBy("name", "asc")),
            (snapshot) => {
                const categories = this.mapQuerySnapshotToCategories(snapshot);
                this.categories.set(categories);
            },
            (error) => {
                console.error("Error en listener de categories:", error);
                this.error.set(`Error en sincronización: ${error}`);
            }
        );

        onSnapshot(
            query(this.tagsCollection, orderBy("prompt_count", "desc")),
            (snapshot) => {
                const tags = this.mapQuerySnapshotToTags(snapshot);
                this.tags.set(tags);
            },
            (error) => {
                console.error("Error en listener de tags:", error);
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
     * Mapear QuerySnapshot a array de Prompts
     */
    private mapQuerySnapshotToCategories(
        querySnapshot: QuerySnapshot<DocumentData>
    ): FirestoreCategory[] {
        return querySnapshot.docs.map((doc) => this.mapDocumentToCategory(doc.id, doc.data()));
    }

    private mapQuerySnapshotToTags(querySnapshot: QuerySnapshot<DocumentData>): FirestoreTag[] {
        return querySnapshot.docs.map((doc) => this.mapDocumentToTag(doc.id, doc.data()));
    }

    /**
     * Mapear documento a Prompt
     */
    private mapDocumentToPrompt(id: string, data: DocumentData): Prompt {
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
