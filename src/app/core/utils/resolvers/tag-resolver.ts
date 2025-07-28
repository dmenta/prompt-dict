import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ListPrompts, AppDataService } from "../../services";
import { getSlug } from "./slug-param";

@Injectable({
    providedIn: "root",
})
export class TagResolver implements Resolve<ListPrompts> {
    constructor(private appDataService: AppDataService, private router: Router) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListPrompts> {
        const name =
            this.router.getCurrentNavigation()?.extras.state?.["name"] ??
            (await this.appDataService.tagNameBySlug(getSlug(route)));
        if (name) {
            return this.appDataService.byTagName(name);
        }

        throw new Error("Route parameter 'slug' is required");
    }
}
