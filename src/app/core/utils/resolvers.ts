import { Injectable } from "@angular/core";
import {
    Resolve,
    Router,
    type ActivatedRouteSnapshot,
    type RouterStateSnapshot,
} from "@angular/router";
import { AppDataService, ListPrompts } from "../services";
import { Prompt } from "../models";

function getSlug(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get("id");
    if (!id) {
        throw new Error("Route parameter 'id' is required");
    }
    return id;
}

@Injectable({
    providedIn: "root",
})
class PromptResolver implements Resolve<Prompt> {
    constructor(private appDataService: AppDataService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Prompt> {
        const slug = getSlug(route);

        if (!slug) {
            throw new Error("Route parameter 'slug' is required");
        }

        return this.appDataService.bySlug(slug);
    }
}

@Injectable({
    providedIn: "root",
})
class CategoryResolver implements Resolve<ListPrompts> {
    constructor(private appDataService: AppDataService, private router: Router) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListPrompts> {
        const name =
            this.router.getCurrentNavigation()?.extras.state?.["name"] ??
            (await this.appDataService.categoryNameBySlug(getSlug(route)));

        if (name) {
            return this.appDataService.byCategoryName(name);
        }

        throw new Error("Route parameter 'slug' is required");
    }
}

@Injectable({
    providedIn: "root",
})
class TagResolver implements Resolve<ListPrompts> {
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
export { PromptResolver, CategoryResolver, TagResolver };
