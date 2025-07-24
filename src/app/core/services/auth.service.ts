import { Injectable, inject } from "@angular/core";
import { Auth, signInWithPopup, signOut, GoogleAuthProvider, User } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
    private auth = inject(Auth);

    /** Inicia sesión con Google */
    loginWithGoogle(): Promise<User | null> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider)
            .then((result) => result.user)
            .catch(() => null);
    }

    /** Cierra la sesión actual */
    logout(): Promise<void> {
        return signOut(this.auth);
    }

    /** Observable del usuario actual */
    get currentUser$(): Observable<User | null> {
        return new Observable((subscriber) => {
            const unsub = this.auth.onAuthStateChanged((user) => subscriber.next(user));
            return { unsubscribe: unsub };
        });
    }
}
