import { Injectable, inject, signal } from "@angular/core";
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc } from "@angular/fire/firestore";
import { Prompt, Tag, Category, AddPrompt } from "../models";
import { getDocs, onSnapshot, query, Unsubscribe, where } from "firebase/firestore";

@Injectable({
    providedIn: "root",
})
export class FirestoreService {
    private readonly firestore = inject(Firestore);

    private readonly promptsSubs: Unsubscribe;
    private readonly catsSubs: Unsubscribe;
    private readonly tagsSubs: Unsubscribe;

    public readonly prompts = signal<Prompt[]>([]);
    public readonly categories = signal<Category[]>([]);
    public readonly tags = signal<Tag[]>([]);

    constructor() {
        this.promptsSubs = this.trackPrompts();
        this.catsSubs = this.trackCategories();
        this.tagsSubs = this.trackTags();
    }

    private trackPrompts(): Unsubscribe {
        const query = collection(this.firestore, "prompts");
        return onSnapshot(query, (snapshot) => {
            const nuevos = [] as Prompt[];

            snapshot.forEach((doc) => {
                nuevos.push({ id: doc.id, ...(doc.data() as Prompt) });
            });

            this.prompts.set(nuevos);
        });
    }

    private trackCategories(): Unsubscribe {
        const query = collection(this.firestore, "categories");
        return onSnapshot(query, (snapshot) => {
            const nuevos = [] as Category[];

            snapshot.forEach((doc) => {
                nuevos.push({ id: doc.id, ...(doc.data() as Category) });
            });

            this.categories.set(nuevos);
        });
    }

    private trackTags(): Unsubscribe {
        const query = collection(this.firestore, "tags");
        return onSnapshot(query, (snapshot) => {
            const nuevos = [] as Tag[];

            snapshot.forEach((doc) => {
                nuevos.push({ id: doc.id, ...(doc.data() as Tag) });
            });

            this.tags.set(nuevos);
        });
    }

    public async categoryNameBySlug(slug: string): Promise<string> {
        if (this.categories().length > 0) {
            return this.categories().find((cat) => cat.slug.toLowerCase() === slug.toLowerCase())!
                .name;
        } else {
            return await getDocs(
                query(collection(this.firestore, "categories"), where("slug", "==", slug))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró una categoria ${slug} `);
                }
                return (docSnap.docs[0].data() as Category).name;
            });
        }
    }

    public async tagNameBySlug(slug: string): Promise<string> {
        if (this.tags().length > 0) {
            return this.tags().find((t) => t.slug.toLowerCase() === slug.toLowerCase())!.name;
        } else {
            return await getDocs(
                query(collection(this.firestore, "tags"), where("slug", "==", slug))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró un etiqueta ${slug} `);
                }
                return (docSnap.docs[0].data() as Tag).name;
            });
        }
    }

    public async getPromptBySlug(slug: string) {
        if (this.prompts().length > 0) {
            return this.prompts().find((p) => p.slug === slug)!;
        } else {
            return await getDocs(
                query(collection(this.firestore, "prompts"), where("slug", "==", slug))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró un pormpt ${slug} `);
                }
                return docSnap.docs[0].data() as Prompt;
            });
        }
    }

    public getPromptById(id: string) {
        return this.prompts().find((p) => p.id === id);
    }

    public async getPromptsByCategory(category: string) {
        if (this.prompts().length > 0) {
            return this.prompts().filter((p) => p.categoria === category);
        } else {
            return await getDocs(
                query(collection(this.firestore, "prompts"), where("categoria", "==", category))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró ningún prompt para la categoría ${category} `);
                }
                return docSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Prompt),
                }));
            });
        }
    }

    public async getPromptsByTag(tag: string) {
        if (this.prompts().length > 0) {
            return this.prompts().filter((p) => p.tags.includes(tag));
        } else {
            return await getDocs(
                query(collection(this.firestore, "prompts"), where("tags", "array-contains", tag))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró ningún prompt para la etiqueta ${tag} `);
                }
                return docSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Prompt),
                }));
            });
        }
    }

    public async createPrompt(prompt: AddPrompt) {
        try {
            const promptData = {
                ...prompt,
                old_id: 900,
                slug: prompt.titulo ?? this.generateSlug(prompt.titulo),
                fecha_creacion: new Date(),
            };

            await addDoc(collection(this.firestore, "prompts"), promptData);
        } catch (error) {
            const errorMessage = `Error al crear prompt: ${error}`;
            console.error(errorMessage);
        }
    }

    public async deletePrompt(id: string) {
        try {
            const docRef = doc(this.firestore, "prompts", id);
            await deleteDoc(docRef);
        } catch (error) {
            const errorMessage = `Error al eliminar prompt ${id}: ${error}`;
            console.error(errorMessage);
        }
    }

    public async updateCategoryPromptCount(name: string, increment: number) {
        const snapsshot = await getDocs(
            query(collection(this.firestore, "categories"), where("name", "==", name))
        );
        if (snapsshot.empty) {
            throw new Error(`No se encontró una categoría con el nombre ${name}`);
        }

        await updateDoc(snapsshot.docs[0].ref, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    public async createCategory(data: Partial<Category>) {
        await addDoc(collection(this.firestore, "categories"), {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        });
    }

    public async updateTagPromptCount(name: string, increment: number) {
        const snapsshot = await getDocs(
            query(collection(this.firestore, "tags"), where("name", "==", name))
        );
        if (snapsshot.empty) {
            throw new Error(`No se encontró una etiqueta con el nombre ${name}`);
        }

        await updateDoc(snapsshot.docs[0].ref, {
            prompt_count: increment,
            fecha_edicion: new Date(),
        });
    }

    public async createTag(data: Partial<Tag>) {
        await addDoc(collection(this.firestore, "tags"), {
            ...data,
            slug: this.generateSlug(data.name || ""),
            fecha_creacion: new Date(),
        });
    }

    public async deleteCategory(name: string) {
        try {
            const snapsshot = await getDocs(
                query(collection(this.firestore, "categories"), where("name", "==", name))
            );
            if (snapsshot.empty) {
                throw new Error(`No se encontró una etiqueta con el nombre ${name}`);
            }
            await deleteDoc(snapsshot.docs[0].ref);
        } catch (error) {
            const errorMessage = `Error al eliminar la categoría ${name}: ${error}`;
            console.error(errorMessage);
        }
    }

    public async deleteTag(name: string) {
        try {
            const snapsshot = await getDocs(
                query(collection(this.firestore, "tags"), where("name", "==", name))
            );
            if (snapsshot.empty) {
                throw new Error(`No se encontró una etiqueta con el nombre ${name}`);
            }
            await deleteDoc(snapsshot.docs[0].ref);
        } catch (error) {
            const errorMessage = `Error al eliminar la etiqueta ${name}: ${error}`;
            console.error(errorMessage);
        }
    }

    public searchPrompts(searchTerm: string) {
        try {
            const normalizedSearch = searchTerm.toLowerCase();
            return this.prompts().filter(
                (prompt) =>
                    prompt.titulo.toLowerCase().includes(normalizedSearch) ||
                    prompt.prompt.toLowerCase().includes(normalizedSearch) ||
                    prompt.descripcion.toLowerCase().includes(normalizedSearch) ||
                    prompt.categoria.toLowerCase().includes(normalizedSearch) ||
                    prompt.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
            );
        } catch (error) {
            const errorMessage = `Error en búsqueda: ${error}`;
            console.error(errorMessage);
            return [] as Prompt[];
        }
    }

    public async updatePrompt(id: string, updates: Partial<Prompt>) {
        try {
            const docRef = doc(this.firestore, "prompts", id);
            await updateDoc(docRef, {
                ...updates,
                fechaModificacion: new Date(),
            });
        } catch (error) {
            const errorMessage = `Error al actualizar prompt ${id}: ${error}`;
            console.error(errorMessage);
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

    ngOnDestroy() {
        this.promptsSubs?.();
        this.catsSubs?.();
        this.tagsSubs?.();
    }
}
