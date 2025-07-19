import { inject } from "@angular/core";
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { DataService } from "../services";
import { map } from "rxjs";

const promptResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(DataService).ready$.pipe(map((s) => s.byId(getId(route))));

const categoryResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(DataService).ready$.pipe(map((s) => s.byCategory(getId(route))));

const tagResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(DataService).ready$.pipe(map((s) => s.byTag(getId(route))));

const promptTitleResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(DataService).ready$.pipe(map((s) => `Prompt | ${s.byId(getId(route)).titulo}`));

const categoryTitleResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(DataService).ready$.pipe(map((s) => `Categoría | ${s.byCategory(getId(route)).name}`));

const tagTitleResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(DataService).ready$.pipe(map((s) => `Etiqueta | ${s.byTag(getId(route)).name}`));

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
