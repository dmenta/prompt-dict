import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AdminService } from "../../core";

@Component({
    selector: "pd-admin-management",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./admin-management.html",
})
export class AdminManagementComponent {
    private adminService = inject(AdminService);
    private fb = inject(FormBuilder);

    admins = signal<{ uid: string; email?: string; creadoPor?: string; fechaCreacion?: any }[]>([]);
    isLoading = signal(false);
    error = signal<string | null>(null);

    form = this.fb.group({
        uid: ["", [Validators.required]],
        email: ["", [Validators.email]],
    });

    constructor() {
        this.loadAdmins();
    }

    async loadAdmins() {
        this.isLoading.set(true);
        this.error.set(null);
        try {
            this.admins.set(await this.adminService.getAdmins());
        } catch (e: any) {
            this.error.set(e.message || "Error al cargar admins");
        } finally {
            this.isLoading.set(false);
        }
    }

    async addAdmin() {
        if (this.form.invalid) return;
        this.isLoading.set(true);
        try {
            await this.adminService.addAdminByUid(
                this.form.value.uid!,
                this.form.value.email || undefined
            );
            this.form.reset();
            await this.loadAdmins();
        } catch (e: any) {
            this.error.set(e.message || "Error al agregar admin");
        } finally {
            this.isLoading.set(false);
        }
    }

    async removeAdmin(uid: string) {
        this.isLoading.set(true);
        try {
            await this.adminService.removeAdmin(uid);
            await this.loadAdmins();
        } catch (e: any) {
            this.error.set(e.message || "Error al eliminar admin");
        } finally {
            this.isLoading.set(false);
        }
    }
}
