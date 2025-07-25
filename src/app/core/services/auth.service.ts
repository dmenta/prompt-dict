import { Injectable, inject } from "@angular/core";
import { Auth, signInWithPopup, signOut, GoogleAuthProvider, User } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly auth = inject(Auth);

    public loginWithGoogle(): Promise<User | null> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider)
            .then((result) => result.user)
            .catch(() => null);
    }

    public logout(): Promise<void> {
        return signOut(this.auth);
    }

    public get currentUser$(): Observable<User | null> {
        return new Observable((subscriber) => {
            const unsub = this.auth.onAuthStateChanged((user) => subscriber.next(user));
            return { unsubscribe: unsub };
        });
    }
}
