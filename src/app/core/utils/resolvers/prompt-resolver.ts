import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Prompt } from "../../models";
import { AppDataService } from "../../services";
import { getSlug } from "./slug-param";

@Injectable({
    providedIn: "root",
})
export class PromptResolver implements Resolve<Prompt> {
    constructor(private appDataService: AppDataService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Prompt> {
        const slug = getSlug(route);

        if (!slug) {
            throw new Error("Route parameter 'slug' is required");
        }

        return this.appDataService.bySlug(slug);
    }
}
