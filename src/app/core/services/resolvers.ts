import { inject } from "@angular/core";
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { PersistService } from "./persist.service";
import { Prompt } from "../../features/prompts/prompt";

export const promptResolve: ResolveFn<Prompt> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(PersistService).byId(Number(route.paramMap.get("id")));
};

export const categoryResolve: ResolveFn<{ name: string; prompts: Prompt[] }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(PersistService).byCategory(<string>route.paramMap.get("id"));
};

export const tagResolve: ResolveFn<{ name: string; prompts: Prompt[] }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(PersistService).byTag(<string>route.paramMap.get("id"));
};

export const promptTitleResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return `Prompt | ${inject(PersistService).byId(Number(route.paramMap.get("id"))).titulo}`;
};

export const categoryTitleResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return `Categoría | ${inject(PersistService).byCategory(<string>route.paramMap.get("id")).name}`;
};

export const tagTitleResolve: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return `Etiqueta | ${inject(PersistService).byTag(<string>route.paramMap.get("id")).name}`;
};
