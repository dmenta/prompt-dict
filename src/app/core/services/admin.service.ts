import { Injectable, inject } from "@angular/core";
import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { Functions, httpsCallable } from "@angular/fire/functions";

@Injectable({ providedIn: "root" })
export class AdminService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);
    private functions = inject(Functions);

    async getAdmins() {
        const adminsCol = collection(this.firestore, "admins");
        const snap = await getDocs(adminsCol);
        return snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    }

    async getUidByEmail(email: string): Promise<{ uid: string; email: string }> {
        const callable = httpsCallable(this.functions, "getUidByEmail");
        const result = await callable({ email });
        // result.data puede ser undefined/null si la función falla
        const data = result && typeof result.data === "object" ? (result.data as any) : {};
        if (!data.uid) throw new Error("No existe un usuario con ese email");
        return { uid: data.uid, email: data.email };
    }

    async addAdminByEmail(email: string) {
        const { uid } = await this.getUidByEmail(email);
        await this.addAdminByUid(uid, email);
    }

    async addAdminByUid(uid: string, email?: string) {
        const ref = doc(this.firestore, "admins", uid);
        await setDoc(ref, { email });
    }

    async removeAdmin(uid: string) {
        const ref = doc(this.firestore, "admins", uid);
        await deleteDoc(ref);
    }
}
