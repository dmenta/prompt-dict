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
    startAfter,
    Timestamp,
} from "firebase/firestore";
import { map, Observable, of, take, tap } from "rxjs";

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

    private promptsPaginados = signal<FirestorePrompt[]>([]);

    private promptsLoaded = signal(false);

    getPrompts() {
        const curr = this.promptsPaginados();
        if (curr.length > 0 && this.promptsLoaded()) {
            return of(curr);
        }
        const lastValue =
            curr.length === 0
                ? [Timestamp.fromDate(new Date()), 1000]
                : [curr[curr.length - 1].fecha_creacion, curr[curr.length - 1].old_id ?? 999];

        return this.getPromptsQuery([
            orderBy("fecha_creacion", "desc"),
            orderBy("old_id", "desc"),
            startAfter(...lastValue),
            limit(10),
        ]).pipe(
            tap((prompts) => {
                if (prompts.length <= 0) {
                    this.promptsLoaded.set(true);
                }
                this.promptsPaginados.set([...curr, ...prompts]);
            }),
            map(() => {
                return this.promptsPaginados();
            })
        );
    }

    getPromptBySlug(slug: string) {
        const curr = this.promptsPaginados();
        if (curr.length > 0) {
            const promptCargado = curr.find((p) => p.slug === slug);
            if (promptCargado) {
                return of(promptCargado);
            }
        }

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
        const curr = this.promptsPaginados();
        if (curr.length > 0) {
            const promptCargado = curr.find((p) => p.id === id);
            if (promptCargado) {
                return of(promptCargado);
            }
        }

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

    async createPrompt(prompt: AddPrompt) {
        try {
            const promptData = {
                ...prompt,
                old_id: 900,
                slug: prompt.titulo ?? this.generateSlug(prompt.titulo),
                fecha_creacion: new Date(),
            };

            const nuevo = await addDoc(this.promptsCollection, promptData).then((docRef) => {
                return docData(docRef, { idField: "id" }) as Observable<FirestorePrompt>;
            });

            return nuevo.pipe(
                tap((prompt) => this.promptsPaginados.update((prompts) => [prompt, ...prompts])),
                map((prompt) => prompt.id)
            );
        } catch (error) {
            const errorMessage = `Error al crear prompt: ${error}`;
            console.error(errorMessage);

            return of(null);
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
            await deleteDoc(docRef).then(() => {
                this.promptsPaginados.update((prompts) =>
                    prompts.filter((prompt) => prompt.id !== id)
                );
            });

            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar prompt ${id}: ${error}`;
            console.error(errorMessage);
            return false;
        }
    }

    async updateCategoryPromptCount(categoryId: string, increment: number) {
        const docRef = doc(this.firestore, "categories", categoryId);
        await updateDoc(docRef, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    async createCategory(data: Partial<FirestoreCategory>) {
        await addDoc(this.categoriesCollection, {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        })
            .then((docRef) => {
                return docData(docRef, { idField: "id" }) as Observable<FirestoreCategory>;
            })
            .then((catNueva) => {
                catNueva.pipe(take(1)).subscribe((cat) =>
                    this.currCategories.update((cats) => {
                        return [...cats, cat];
                    })
                );
            });
    }

    async updateTagPromptCount(tagId: string, increment: number) {
        const docRef = doc(this.firestore, "tags", tagId);
        await updateDoc(docRef, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    async createTag(data: Partial<FirestoreTag>) {
        await addDoc(this.tagsCollection, {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        })
            .then((docRef) => {
                return docData(docRef, { idField: "id" }) as Observable<FirestoreTag>;
            })
            .then((tagNueva) => {
                return tagNueva
                    .pipe(take(1))
                    .subscribe((tag) => this.currTags.update((tags) => [...tags, tag]));
            });
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, "categories", id);
            await deleteDoc(docRef).then(() => {
                this.currCategories.update((cats) => cats.filter((cat) => cat.id !== id));
            });

            return true;
        } catch (error) {
            const errorMessage = `Error al eliminar la categoría ${id}: ${error}`;
            console.error(errorMessage);
            return false;
        }
    }

    async deleteTag(id: string): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, "tags", id);
            await deleteDoc(docRef).then(() => {
                this.currTags.update((tags) => tags.filter((tag) => tag.id !== id));
            });

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
        if (this.currCategories().length > 0) {
            return of(this.currCategories().find((c) => c.slug === slug)!);
        }

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
        if (this.currTags().length > 0) {
            return of(this.currTags().find((c) => c.slug === slug)!);
        }

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
