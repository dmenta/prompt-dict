import { Injectable, signal } from "@angular/core";
import { Router, NavigationEnd, Params } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PreviousRouteService {
  queryParams = signal<Params | undefined>(undefined);
  previousParams = signal<Params | undefined>(undefined);

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const params = new URL(event.urlAfterRedirects, window.location.origin).searchParams;
      const query = [...params.entries()].map(([key, value]) => {
        return { [key]: value };
      }) as Params;

      this.previousParams.set(this.queryParams());
      this.queryParams.set(params.size > 0 ? query[0] : undefined);
    });
  }
}
