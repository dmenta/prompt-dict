import { inject } from "@angular/core";
import { Router, type ActivatedRouteSnapshot, type RouterStateSnapshot } from "@angular/router";
import { AppDataService } from "../services";

const promptResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) =>
    inject(AppDataService).bySlug(getId(route));

const categoryResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const name = inject(Router).getCurrentNavigation()?.extras.state?.["name"];
    if (name) {
        return inject(AppDataService).byCategoryName(name);
    }
    return inject(AppDataService).byCategorySlug(getId(route));
};

const tagResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const name = inject(Router).getCurrentNavigation()?.extras.state?.["name"];
    if (name) {
        return inject(AppDataService).byTagName(name);
    }
    return inject(AppDataService).byTagSlug(getId(route));
};

function getId(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get("id");
    if (!id) {
        throw new Error("Route parameter 'id' is required");
    }
    return id;
}

export { promptResolve, categoryResolve, tagResolve };
