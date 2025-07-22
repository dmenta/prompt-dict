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
    Timestamp,
} from "@angular/fire/firestore";
import { FirestorePrompt, FirestoreTag, FirestoreCategory, AddPrompt } from "../models";
import {
    getDoc,
    limit,
    Query,
    QueryDocumentSnapshot,
    SnapshotOptions,
    startAt,
} from "firebase/firestore";

@Injectable({
    providedIn: "root",
})
export class FirestoreService {
    /**
     * Actualizar el contador de prompts de una categoría
     */
    async updateCategoryPromptCount(categoryId: string, increment: number): Promise<void> {
        const docRef = doc(this.firestore, "categories", categoryId);
        await updateDoc(docRef, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    /**
     * Crear una nueva categoría
     */
    async createCategory(data: Partial<FirestoreCategory>): Promise<void> {
        await addDoc(this.categoriesCollection, {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        });
    }

    /**
     * Actualizar el contador de prompts de un tag
     */
    async updateTagPromptCount(tagId: string, increment: number): Promise<void> {
        const docRef = doc(this.firestore, "tags", tagId);
        await updateDoc(docRef, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    /**
     * Crear un nuevo tag
     */
    async createTag(data: Partial<FirestoreTag>): Promise<void> {
        await addDoc(this.tagsCollection, {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        });
    }
    private firestore = inject(Firestore);

    // Collections references
    private promptsCollection = collection(this.firestore, "prompts");
    private categoriesCollection = collection(this.firestore, "categories");
    private tagsCollection = collection(this.firestore, "tags");

    private currCategories = signal([] as FirestoreCategory[]);
    private currTags = signal([] as FirestoreTag[]);
    private currPrompts = signal<FirestorePrompt[]>([]);

    public error = signal<string | null>(null);

    /**
     * Obtener todos los prompts
     */
    async getPrompts(): Promise<FirestorePrompt[]> {
        const curr = this.currPrompts();
        const lastId = curr.length === 0 ? 0 : curr[curr.length - 1].old_id;

        return this.getPromptsQuery(
            query(this.promptsCollection, orderBy("old_id", "asc"), startAt(lastId), limit(10))
        ).then((prompts) => {
            this.currPrompts.set([...curr, ...prompts.slice(1)]);
            return this.currPrompts();
        });
    }

    /**
     * Obtener un prompt por ID
     */
    async getPromptBySlug(slug: string): Promise<FirestorePrompt | null> {
        return this.getPromptsQuery(
            query(this.promptsCollection, where("slug", "==", slug), limit(1))
        ).then((prompts) => {
            if (prompts.length === 0) {
                return null;
            }
            return prompts[0];
        });
    }

    async getPromptById(id: string): Promise<FirestorePrompt | null> {
        try {
            const docRef = doc(this.firestore, "prompts", id).withConverter(promptConverter);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            return docSnap.data();
        } catch (error) {
            const errorMessage = `Error al obtener prompt ${id}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return null;
        }
    }

    /**
     * Obtener prompts por categoría
     */
    async getPromptsByCategory(category: string): Promise<FirestorePrompt[]> {
        return this.getPromptsQuery(
            query(this.promptsCollection, where("categoria", "==", category))
        );
    }

    /**
     * Obtener prompts por tag
     */
    async getPromptsByTag(tag: string): Promise<FirestorePrompt[]> {
        return this.getPromptsQuery(
            query(this.promptsCollection, where("tags", "array-contains", tag))
        );
    }

    private async getPromptsQuery(
        query: Query<DocumentData, DocumentData>
    ): Promise<FirestorePrompt[]> {
        try {
            this.error.set(null);
            const q = query.withConverter(promptConverter);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => doc.data());
        } catch (error) {
            const errorMessage = `Error al obtener prompts: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return [];
        }
    }

    /**
     * Crear un nuevo prompt
     */
    async createPrompt(prompt: AddPrompt): Promise<string | null> {
        try {
            this.error.set(null);
            const promptData = {
                ...prompt,
                old_id: -1,
                slug: prompt.titulo ?? this.generateSlug(prompt.titulo),
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
     * Eliminar una categoria
     */
    async deleteCategory(id: string): Promise<boolean> {
        try {
            this.error.set(null);
            const docRef = doc(this.firestore, "categories", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar la categoría ${id}: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return false;
        }
    }

    /**
     * Eliminar una etiqueta
     */
    async deleteTag(id: string): Promise<boolean> {
        try {
            this.error.set(null);
            const docRef = doc(this.firestore, "tags", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar la etiqueta ${id}: ${error}`;
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
     * Obtener lista de categorias
     */
    async getCategories(): Promise<FirestoreCategory[]> {
        if (this.currCategories().length > 0) {
            return this.currCategories();
        }

        return this.getElementsQuery(query(this.categoriesCollection)).then((categories) => {
            if (categories === null) {
                return [];
            }
            this.currCategories.set(categories);
            return categories;
        });
    }

    /**
     * Obtener lista de etiquetas
     */
    async getTags(): Promise<FirestoreTag[]> {
        if (this.currTags().length > 0) {
            return this.currTags();
        }

        return this.getElementsQuery(query(this.tagsCollection)).then((tags) => {
            if (tags === null) {
                return [];
            }
            this.currTags.set(tags);
            return tags;
        });
    }

    /**
     * Obtener un prompt por ID
     */
    async getCategoryBySlug(slug: string): Promise<FirestoreCategory | null> {
        return this.getElementsQuery(
            query(this.categoriesCollection, where("slug", "==", slug), limit(1))
        ).then((categories) => {
            if (categories === null || categories.length === 0) {
                return null;
            }
            return categories[0];
        });
    }

    async getTagBySlug(slug: string): Promise<FirestoreTag | null> {
        return this.getElementsQuery(
            query(this.tagsCollection, where("slug", "==", slug), limit(1))
        ).then((tags) => {
            if (tags === null || tags.length === 0) {
                return null;
            }
            return tags[0];
        });
    }

    private async getElementsQuery(
        query: Query<DocumentData, DocumentData>
    ): Promise<(FirestoreCategory | FirestoreTag)[] | null> {
        try {
            this.error.set(null);
            const q = query.withConverter(elementConverter);
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }
            return querySnapshot.docs.map((doc) => doc.data());
        } catch (error) {
            const errorMessage = `Error al obtener elementos: ${error}`;
            this.error.set(errorMessage);
            console.error(errorMessage);
            return null;
        }
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

const elementConverter = {
    toFirestore: (element: FirestoreCategory | FirestoreTag): DocumentData => {
        return {
            name: element.name,
            slug: element.slug,
            prompt_count: element.prompt_count,
            fecha_creacion: new Date(),
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return {
            id: data["id"] || (snapshot.id as string),
            name: data["name"] as string,
            slug: data["slug"] as string,
            prompt_count: Number(data["prompt_count"]) || (0 as number),
            fecha_creacion: (<Timestamp>data["fecha_creacion"])?.toDate() || new Date(),
        };
    },
};

const promptConverter = {
    toFirestore: (element: FirestorePrompt): DocumentData => {
        return {
            old_id: element.old_id,
            titulo: element.titulo,
            prompt: element.prompt,
            descripcion: element.descripcion,
            autor: element.autor,
            categoria: element.categoria,
            tags: element.tags,
            uso: element.uso,
            idioma: element.idioma,
            fecha_creacion: element.fecha_creacion,
            slug: element.slug,
            fecha_edicion: element.fecha_edicion,
            modelo: element.modelo,
            ejemplo: element.ejemplo,
            fuente: element.fuente,
            referencias: element.referencias,
            notas: element.notas,
            estado: element.estado,
            version: element.version,
            comentarios: element.comentarios,
            feedback: element.feedback,
            rating: element.rating,
            visibilidad: element.visibilidad,
            licencia: element.licencia,
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return {
            id: data["id"] || (snapshot.id as string),
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
            slug: data["slug"],
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
    },
};
