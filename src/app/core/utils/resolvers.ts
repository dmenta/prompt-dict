import { inject } from "@angular/core";
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AppDataService } from "../services";

const promptResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).byId(getId(route));

const categoryResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).byCategory(getId(route));

const tagResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).byTag(getId(route));

function getId(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get("id");
    if (!id) {
        throw new Error("Route parameter 'id' is required");
    }
    return id;
}

export { promptResolve, categoryResolve, tagResolve };
