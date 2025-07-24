import { Injectable, signal } from "@angular/core";
import { Firestore, Unsubscribe, collection, getDocs, onSnapshot } from "@angular/fire/firestore";
import { Category, Tag } from "../models";
import { query, where } from "firebase/firestore";

@Injectable({ providedIn: "root" })
export class DefaultNavigationStore {
    store: Firestore;
    catsSubs: Unsubscribe;
    tagsSubs: Unsubscribe;

    public categories = signal<Category[]>([]);
    public tags = signal<Tag[]>([]);
    constructor(store: Firestore) {
        this.store = store;

        this.catsSubs = this.trackCategories();
        this.tagsSubs = this.trackTags();
    }
    trackCategories(): Unsubscribe {
        const query = collection(this.store, "categories");
        return onSnapshot(query, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    this.categories.update((categories) => [
                        ...categories,
                        { id: change.doc.id, ...(change.doc.data() as Category) },
                    ]);
                }
                if (change.type === "modified") {
                    this.categories.update((categories) => {
                        const index = categories.findIndex((cat) => cat.id === change.doc.id);
                        if (index !== -1) {
                            categories[index] = {
                                id: change.doc.id,
                                ...(change.doc.data() as Category),
                            };
                        }

                        return [...categories];
                    });
                }
                if (change.type === "removed") {
                    this.categories.update((categories) =>
                        categories.filter((cat) => cat.id !== change.doc.id)
                    );
                }
            });
        });
    }

    trackTags(): Unsubscribe {
        const query = collection(this.store, "tags");
        return onSnapshot(query, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    this.tags.update((tags) => [
                        ...tags,
                        { id: change.doc.id, ...(change.doc.data() as Tag) },
                    ]);
                }
                if (change.type === "modified") {
                    this.tags.update((tags) => {
                        const index = tags.findIndex((cat) => cat.id === change.doc.id);
                        if (index !== -1) {
                            tags[index] = { id: change.doc.id, ...(change.doc.data() as Tag) };
                        }

                        return [...tags];
                    });
                }
                if (change.type === "removed") {
                    this.tags.update((tags) => tags.filter((cat) => cat.id !== change.doc.id));
                }
            });
        });
    }

    async categoryNameBySlug(slug: string): Promise<string> {
        if (this.categories().length > 0) {
            return this.categories().find((cat) => cat.slug.toLowerCase() === slug.toLowerCase())!
                .name;
        } else {
            return await getDocs(
                query(collection(this.store, "categories"), where("slug", "==", slug))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró una categoria ${slug} `);
                }
                return (docSnap.docs[0].data() as Category).name;
            });
        }
    }
    async tagNameBySlug(slug: string): Promise<string> {
        if (this.tags().length > 0) {
            return this.tags().find((t) => t.slug.toLowerCase() === slug.toLowerCase())!.name;
        } else {
            return await getDocs(
                query(collection(this.store, "tags"), where("slug", "==", slug))
            ).then((docSnap) => {
                if (docSnap.empty) {
                    throw new Error(`No se encontró un etiqueta ${slug} `);
                }
                return (docSnap.docs[0].data() as Tag).name;
            });
        }
    }

    ngOnDestroy() {
        this.catsSubs?.();
        this.tagsSubs?.();
    }
}
