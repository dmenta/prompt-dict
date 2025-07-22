import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AdminService } from "../services/admin.service";
import { map, take } from "rxjs";
import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(private adminService: AdminService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.adminService.isCurrentUserAdmin().pipe(
            take(1), // Take only the first emitted value and complete
            map((isAdmin) => {
                if (isAdmin) {
                    return true; // Allow access
                } else {
                    return this.router.createUrlTree(["/"]);
                }
            })
        );
    }
}
