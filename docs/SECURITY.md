# 🔒 Configuración de Seguridad para Firebase

## ⚠️ IMPORTANTE: Manejo seguro de API Keys

Las API Keys de Firebase ahora están gestionadas de forma segura y **NO** se commitean al repositorio.

## 🛠️ Configuración Local

### 1. Crear archivo de configuración local

Crea el archivo `.env.local` en la raíz del proyecto con tus claves reales:

```bash
# .env.local - Este archivo NO se commitea
FIREBASE_API_KEY=tu-api-key-real
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
FIREBASE_APP_ID=tu-app-id
FIREBASE_MEASUREMENT_ID=tu-measurement-id
```

### 2. Scripts disponibles

```bash
# Desarrollo (usa .env.local automáticamente)
npm start

# Build con inyección de variables de entorno
npm run build:prod

# Deploy completo
npm run deploy
```

## 🚀 Configuración en GitHub

### 1. Configurar GitHub Secrets

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions

Agrega estos secrets:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

### 2. Deploy automático

El archivo `.github/workflows/deploy.yml` se ejecutará automáticamente cuando hagas push a `master`:

1. ✅ Instala dependencias
2. ✅ Usa los secrets de GitHub como variables de entorno
3. ✅ Construye la aplicación con las claves reales
4. ✅ Despliega a GitHub Pages

## 🔍 Cómo funciona

### En desarrollo:
- Las claves se leen desde `.env.local`
- El archivo `.env.local` está en `.gitignore`

### En producción (GitHub Actions):
- Las claves se leen desde GitHub Secrets
- Se inyectan en `index.html` durante el build
- No quedan expuestas en el código fuente

### Fallback para desarrollo:
- Si no hay `.env.local`, usa valores por defecto (environment.ts)
- Esto permite que otros desarrolladores puedan ejecutar la app sin configuración

## 📋 Checklist de seguridad

- [ ] ✅ `.env.local` está en `.gitignore`
- [ ] ✅ API Keys removidas de `environment.prod.ts`
- [ ] ✅ GitHub Secrets configurados
- [ ] ✅ Workflow de deploy configurado
- [ ] ✅ Variables se inyectan en tiempo de build

## 🆘 Troubleshooting

### Error: "Firebase configuration object does not contain a valid..."

1. Verifica que `.env.local` existe y tiene las claves correctas
2. En GitHub Actions, verifica que todos los secrets están configurados
3. Revisa que los nombres de las variables coinciden exactamente

### Para revisar qué variables están disponibles:

```javascript
// En la consola del navegador
console.log(window.ENV);
```

### Firebase API Key es pública

**Nota importante**: La API Key de Firebase para aplicaciones web es pública por diseño. La seguridad real está en las reglas de Firestore, no en ocultar la API Key.

Sin embargo, es una buena práctica no commitear configuraciones, y este setup te permite también manejar otros secrets más sensibles en el futuro.
