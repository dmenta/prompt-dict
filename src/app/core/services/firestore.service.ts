import { Injectable, inject, signal } from "@angular/core";
import {
    Firestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    docData,
    collectionData,
} from "@angular/fire/firestore";
import { FirestorePrompt, FirestoreTag, FirestoreCategory, AddPrompt } from "../models";
import {
    CollectionReference,
    DocumentData,
    limit,
    QueryConstraint,
    startAt,
} from "firebase/firestore";
import { map, Observable, of, tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class FirestoreService {
    private firestore = inject(Firestore);

    private promptsCollection = collection(this.firestore, "prompts");
    private categoriesCollection = collection(this.firestore, "categories");
    private tagsCollection = collection(this.firestore, "tags");

    private currCategories = signal([] as FirestoreCategory[]);
    private currTags = signal([] as FirestoreTag[]);
    private currPrompts = signal<FirestorePrompt[]>([]);

    getPrompts() {
        const curr = this.currPrompts();
        const lastId = curr.length === 0 ? 0 : curr[curr.length - 1].old_id;

        return this.getPromptsQuery([orderBy("old_id", "asc"), startAt(lastId), limit(10)]).pipe(
            tap((prompts) => this.currPrompts.set([...curr, ...prompts.slice(1)])),
            map(() => {
                return this.currPrompts();
            })
        );
    }

    getPromptBySlug(slug: string) {
        return this.getPromptsQuery([where("slug", "==", slug), limit(1)]).pipe(
            map((prompts) => {
                if (prompts.length === 0) {
                    return null;
                }
                return prompts[0];
            })
        );
    }

    getPromptById(id: string) {
        try {
            const docRef = doc(this.firestore, `prompts/${id}`);

            return docData(docRef, { idField: "id" }) as Observable<FirestorePrompt>;
        } catch (error) {
            const errorMessage = `Error al obtener prompt ${id}: ${error}`;
            console.error(errorMessage);
            return null;
        }
    }

    getPromptsByCategory(category: string) {
        return this.getPromptsQuery([where("categoria", "==", category)]);
    }

    getPromptsByTag(tag: string) {
        return this.getPromptsQuery([where("tags", "array-contains", tag)]);
    }

    private getPromptsQuery(constraints: QueryConstraint[]) {
        try {
            return collectionData(query(this.promptsCollection, ...constraints), {
                idField: "id",
            }) as Observable<FirestorePrompt[]>;
        } catch (error) {
            const errorMessage = `Error al obtener prompts: ${error}`;
            console.error(errorMessage);
            return of([]);
        }
    }

    async createPrompt(prompt: AddPrompt): Promise<string | null> {
        try {
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
            console.error(errorMessage);
            return null;
        }
    }

    async updatePrompt(id: string, updates: Partial<FirestorePrompt>): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, "prompts", id);
            await updateDoc(docRef, {
                ...updates,
                fechaModificacion: new Date(),
            });
            return true;
        } catch (error) {
            const errorMessage = `Error al actualizar prompt ${id}: ${error}`;
            console.error(errorMessage);
            return false;
        }
    }

    async deletePrompt(id: string): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, "prompts", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar prompt ${id}: ${error}`;
            console.error(errorMessage);
            return false;
        }
    }

    async updateCategoryPromptCount(categoryId: string, increment: number): Promise<void> {
        const docRef = doc(this.firestore, "categories", categoryId);
        await updateDoc(docRef, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    async createCategory(data: Partial<FirestoreCategory>): Promise<void> {
        await addDoc(this.categoriesCollection, {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        });
    }

    async updateTagPromptCount(tagId: string, increment: number): Promise<void> {
        const docRef = doc(this.firestore, "tags", tagId);
        await updateDoc(docRef, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    async createTag(data: Partial<FirestoreTag>): Promise<void> {
        await addDoc(this.tagsCollection, {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        });
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, "categories", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar la categoría ${id}: ${error}`;
            console.error(errorMessage);
            return false;
        }
    }

    async daleteTag(id: string): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, "tags", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar la etiqueta ${id}: ${error}`;
            console.error(errorMessage);
            return false;
        }
    }

    searchPrompts(searchTerm: string) {
        try {
            const normalizedSearch = searchTerm.toLowerCase();
            return this.getPrompts().pipe(
                map((allPrompts) => {
                    return allPrompts.filter(
                        (prompt) =>
                            prompt.titulo.toLowerCase().includes(normalizedSearch) ||
                            prompt.prompt.toLowerCase().includes(normalizedSearch) ||
                            prompt.descripcion.toLowerCase().includes(normalizedSearch) ||
                            prompt.categoria.toLowerCase().includes(normalizedSearch) ||
                            prompt.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
                    );
                })
            );
        } catch (error) {
            const errorMessage = `Error en búsqueda: ${error}`;
            console.error(errorMessage);
            return of([]);
        }
    }

    getCategories() {
        if (this.currCategories().length > 0) {
            return of(this.currCategories());
        }

        return (
            collectionData(this.categoriesCollection, { idField: "id" }) as Observable<
                FirestoreCategory[]
            >
        ).pipe(tap((categories) => this.currCategories.set(categories)));
    }

    getTags() {
        if (this.currTags().length > 0) {
            return of(this.currTags());
        }

        return (
            collectionData(this.tagsCollection, { idField: "id" }) as Observable<FirestoreTag[]>
        ).pipe(tap((tags) => this.currTags.set(tags)));
    }

    getCategoryBySlug(slug: string) {
        return this.getElementsQuery<FirestoreCategory>(this.categoriesCollection, [
            where("slug", "==", slug),
            limit(1),
        ]).pipe(
            map((categories) => {
                if (categories === null || categories.length === 0) {
                    return null;
                }
                return categories[0];
            })
        );
    }

    getTagBySlug(slug: string) {
        return this.getElementsQuery<FirestoreTag>(this.tagsCollection, [
            where("slug", "==", slug),
            limit(1),
        ]).pipe(
            map((tags) => {
                if (tags === null || tags.length === 0) {
                    return null;
                }
                return tags[0];
            })
        );
    }

    private getElementsQuery<T>(
        elementCollection: CollectionReference<DocumentData, DocumentData>,
        constraints: QueryConstraint[]
    ) {
        try {
            return collectionData(query(elementCollection, ...constraints), {
                idField: "id",
            }) as Observable<T[]>;
        } catch (error) {
            const errorMessage = `Error al obtener: ${error}`;
            console.error(errorMessage);
            return of([]);
        }
    }

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
