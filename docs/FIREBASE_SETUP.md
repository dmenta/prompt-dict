# Configuración de Firebase para Prompt Dictionary

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En la configuración del proyecto, agrega una aplicación web
4. Copia la configuración que te proporcione Firebase

### 2. Configurar Firestore Database

1. En Firebase Console, ve a "Firestore Database"
2. Crea la base de datos en modo de prueba o producción
3. Configura las reglas de seguridad según tus necesidades:

```javascript
// Reglas básicas para desarrollo (más permisivas)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
    }
  }
}
```

```javascript
// Reglas para producción (más restrictivas)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /prompts/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /tags/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Actualizar archivos de configuración

Actualiza los siguientes archivos con tu configuración de Firebase:

#### `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "tu-api-key-aqui",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "tu-sender-id",
    appId: "tu-app-id"
  }
};
```

#### `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "tu-api-key-de-produccion",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "tu-sender-id",
    appId: "tu-app-id"
  }
};
```

### 4. Usar la aplicación

1. Ejecuta la aplicación: `ng serve`
2. Ve a `/admin` para acceder al panel de administración
3. Haz clic en "Migrar Datos a Firestore" para subir tus datos locales
4. Una vez migrado, puedes alternar entre datos locales y Firestore

### 5. Estructura de datos en Firestore

La aplicación creará las siguientes colecciones:

#### `prompts` Collection
```typescript
{
  titulo: string;
  prompt: string;
  descripcion: string;
  autor: string;
  categoria: string;
  tags: string[];
  uso?: "texto" | "código" | "imagen" | "video" | "audio" | "otro";
  idioma?: string;
  fecha_creacion?: Date;
  slug?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  // ... otros campos opcionales
}
```

#### `categories` Collection (futuro)
```typescript
{
  name: string;
  slug: string;
  promptCount: number;
  createdAt: Date;
}
```

#### `tags` Collection (futuro)
```typescript
{
  name: string;
  slug: string;
  promptCount: number;
  createdAt: Date;
}
```

## 🔄 Cambiar entre fuentes de datos

La aplicación incluye un servicio `AppDataService` que permite alternar entre:

- **Datos locales**: Lee desde `public/data.json`
- **Firestore**: Lee desde la base de datos en la nube

### En el código:

```typescript
import { AppDataService } from './core/services';

// Inyectar el servicio
constructor(private appDataService: AppDataService) {}

// Cambiar a Firestore
this.appDataService.switchToFirestore();

// Cambiar a datos locales
this.appDataService.switchToLocal();

// Los datos se actualizan automáticamente gracias a los signals
```

## 🚀 Beneficios de usar Firestore

- ✅ **Sincronización en tiempo real**: Los cambios se reflejan instantáneamente
- ✅ **Escalabilidad**: Maneja grandes volúmenes de datos
- ✅ **Offline support**: Funciona sin conexión
- ✅ **Búsqueda avanzada**: Se puede integrar con Algolia o ElasticSearch
- ✅ **Autenticación**: Control de acceso granular
- ✅ **Versionado**: Historial de cambios automático

## 🛠️ Próximos pasos

1. **Autenticación**: Agregar login/logout con Firebase Auth
2. **CRUD completo**: Crear, editar y eliminar prompts desde la UI
3. **Búsqueda avanzada**: Integrar con Algolia para búsqueda más potente
4. **Categorías dinámicas**: Gestionar categorías desde la aplicación
5. **Estadísticas**: Dashboard con métricas de uso
6. **Exportación**: Backup de datos desde Firestore
