import { Component, inject } from "@angular/core";
import { AppDataService, DataSource } from "../../core/services/app-data.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-admin",
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="max-w-4xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Administración de Datos
            </h1>

            <!-- Estado actual -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Estado Actual
                </h2>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >Fuente de datos:</label
                        >
                        <p
                            class="text-lg font-semibold"
                            [class]="dataSource() === 'local' ? 'text-blue-600' : 'text-green-600'">
                            {{ dataSource() === "local" ? "Local (JSON)" : "Firestore (Cloud)" }}
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >Total prompts:</label
                        >
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">
                            {{ appDataService.prompts().length }}
                        </p>
                    </div>
                </div>

                @if (appDataService.isLoading()) {
                <div class="flex items-center text-blue-600">
                    <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span>Cargando datos...</span>
                </div>
                } @if (appDataService.error()) {
                <div
                    class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p class="text-red-800 dark:text-red-200">{{ appDataService.error() }}</p>
                </div>
                }
            </div>

            <!-- Controles -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Cambiar Fuente de Datos
                </h2>

                <div class="space-y-4">
                    <button
                        (click)="switchToLocal()"
                        [disabled]="dataSource() === 'local'"
                        [class]="
                            dataSource() === 'local'
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        "
                        class="px-4 py-2 rounded-md font-medium transition-colors">
                        Usar Datos Locales
                    </button>

                    <button
                        (click)="switchToFirestore()"
                        [disabled]="dataSource() === 'firestore'"
                        [class]="
                            dataSource() === 'firestore'
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        "
                        class="px-4 py-2 rounded-md font-medium transition-colors ml-4">
                        Usar Firestore
                    </button>
                </div>
            </div>

            <!-- Migración -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Migración de Datos
                </h2>

                <div class="mb-4">
                    <p class="text-gray-600 dark:text-gray-400 mb-2">
                        Migra todos los datos locales a Firestore. Esta acción solo debe ejecutarse
                        una vez.
                    </p>

                    @if (dataSource() === 'firestore' && appDataService.prompts().length > 0) {
                    <div
                        class="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-md p-3 mb-4">
                        <p class="text-green-800 dark:text-green-200">
                            ✅ Los datos ya están en Firestore
                        </p>
                    </div>
                    }
                </div>

                <button
                    (click)="migrateData()"
                    [disabled]="
                        isMigrating ||
                        (dataSource() === 'firestore' && appDataService.prompts().length > 0)
                    "
                    [class]="
                        isMigrating ||
                        (dataSource() === 'firestore' && appDataService.prompts().length > 0)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                    "
                    class="px-6 py-2 rounded-md font-medium transition-colors">
                    @if (isMigrating) {
                    <div class="flex items-center">
                        <div
                            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Migrando...
                    </div>
                    } @else { Migrar Datos a Firestore }
                </button>

                @if (migrationResult) {
                <div
                    class="mt-4 p-3 rounded-md"
                    [class]="
                        migrationResult.success
                            ? 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800'
                    ">
                    <p
                        [class]="
                            migrationResult.success
                                ? 'text-green-800 dark:text-green-200'
                                : 'text-red-800 dark:text-red-200'
                        ">
                        {{ migrationResult.message }}
                    </p>
                </div>
                }
            </div>

            <!-- Información sobre configuración -->
            <div
                class="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-6">
                <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    ⚠️ Configuración de Firebase
                </h3>
                <p class="text-yellow-700 dark:text-yellow-300 text-sm">
                    Para usar Firestore, asegúrate de actualizar la configuración de Firebase en los
                    archivos:
                </p>
                <ul
                    class="list-disc list-inside text-yellow-700 dark:text-yellow-300 text-sm mt-2 ml-4">
                    <li><code>src/environments/environment.ts</code></li>
                    <li><code>src/environments/environment.prod.ts</code></li>
                </ul>
                <p class="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                    Reemplaza los valores "your-*" con los datos reales de tu proyecto de Firebase.
                </p>
            </div>
        </div>
    `,
})
export class AdminComponent {
    appDataService = inject(AppDataService);

    isMigrating = false;
    migrationResult: { success: boolean; message: string } | null = null;

    dataSource = this.appDataService.dataSource;

    switchToLocal() {
        this.appDataService.switchToLocal();
        this.migrationResult = null;
    }

    switchToFirestore() {
        this.appDataService.switchToFirestore();
        this.migrationResult = null;
    }

    async migrateData() {
        this.isMigrating = true;
        this.migrationResult = null;

        try {
            const success = await this.appDataService.migrateToFirestore();

            if (success) {
                this.migrationResult = {
                    success: true,
                    message:
                        "✅ Migración completada exitosamente. Los datos están ahora en Firestore.",
                };
            } else {
                this.migrationResult = {
                    success: false,
                    message: "❌ Error durante la migración. Revisa la consola para más detalles.",
                };
            }
        } catch (error) {
            this.migrationResult = {
                success: false,
                message: `❌ Error durante la migración: ${error}`,
            };
        } finally {
            this.isMigrating = false;
        }
    }
}
