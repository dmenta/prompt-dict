import { ActivatedRouteSnapshot } from "@angular/router";

export function getSlug(route: ActivatedRouteSnapshot): string {
    const id = route.paramMap.get("id");
    if (!id) {
        throw new Error("Route parameter 'id' is required");
    }
    return id;
}
