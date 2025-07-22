import { inject } from "@angular/core";
import { Router, type ActivatedRouteSnapshot, type RouterStateSnapshot } from "@angular/router";
import { AppDataService } from "../services";

const promptResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const id = inject(Router).getCurrentNavigation()?.extras.state?.["id"];
    if (id) {
        return inject(AppDataService).byId(id);
    }
    return inject(AppDataService).bySlug(getSlug(route));
};

const categoryResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const name = inject(Router).getCurrentNavigation()?.extras.state?.["name"];
    if (name) {
        return inject(AppDataService).byCategoryName(name);
    }
    return inject(AppDataService).byCategorySlug(getSlug(route));
};

const tagResolve = (route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
    const name = inject(Router).getCurrentNavigation()?.extras.state?.["name"];
    if (name) {
        return inject(AppDataService).byTagName(name);
    }
    return inject(AppDataService).byTagSlug(getSlug(route));
};

function getSlug(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get("id");
    if (!id) {
        throw new Error("Route parameter 'id' is required");
    }
    return id;
}

export { promptResolve, categoryResolve, tagResolve };
