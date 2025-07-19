import { inject } from "@angular/core";
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AppDataService } from "../services";

const promptResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).byId(getId(route));

const categoryResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).byCategory(getId(route));

const tagResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).byTag(getId(route));

const promptTitleResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService)
        .byId(getId(route))
        .then((p) => `Prompt | ${p.titulo}`);

const categoryTitleResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService)
        .byCategory(getId(route))
        .then((p) => `Categoría | ${p.name}`);

const tagTitleResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService)
        .byTag(getId(route))
        .then((s) => `Etiqueta | ${s.name}`);

function getId(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get("id");
    if (!id) {
        throw new Error("Route parameter 'id' is required");
    }
    return id;
}

export {
    promptResolve,
    categoryResolve,
    tagResolve,
    promptTitleResolve,
    categoryTitleResolve,
    tagTitleResolve,
};
