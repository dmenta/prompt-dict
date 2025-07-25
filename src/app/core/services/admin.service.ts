import { Injectable, inject } from "@angular/core";
import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { Observable, from, map, of, switchMap, tap } from "rxjs";

@Injectable({ providedIn: "root" })
export class AdminService {
    private readonly firestore = inject(Firestore);
    private readonly auth = inject(Auth);
    private isAdminCache: { [uid: string]: boolean } = {};

    public async getAdmins() {
        const adminsCol = collection(this.firestore, "admins");
        const snap = await getDocs(adminsCol);
        return snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    }

    public async addAdminByUid(uid: string, email?: string) {
        const ref = doc(this.firestore, "admins", uid);
        await setDoc(ref, { email });
    }

    public async removeAdmin(uid: string) {
        const ref = doc(this.firestore, "admins", uid);
        await deleteDoc(ref);
    }

    public isCurrentUserAdmin(): Observable<boolean> {
        if (!this.auth.currentUser) {
            this.isAdminCache = {};
            return of(false);
        }

        if (this.isAdminCache.hasOwnProperty(this.auth.currentUser.uid)) {
            return of(this.isAdminCache[this.auth.currentUser.uid]);
        }

        return from(this.auth.currentUser.getIdToken()).pipe(
            switchMap(() => {
                const uid = this.auth.currentUser?.uid;
                if (!uid) {
                    return of(false);
                }
                return of(doc(this.firestore, "admins", uid)).pipe(
                    map((ref) => ref.id === uid),
                    tap((isAdmin) => {
                        this.isAdminCache[uid] = isAdmin;
                    })
                );
            })
        );
    }
}
