import { Component } from "@angular/core";
import { AdminManagementComponent } from "../../features/admin/admin-management.component";

@Component({
    selector: "pd-admin-page",
    standalone: true,
    imports: [AdminManagementComponent],
    template: `<pd-admin-management></pd-admin-management>`,
})
export class AdminPage {}
