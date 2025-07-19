#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Función para cargar variables de entorno desde archivo .env.local
function loadEnvFromFile() {
    const envPath = path.join(__dirname, "..", ".env.local");
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const envVars = {};

        envContent.split("\n").forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith("#")) {
                const [key, value] = trimmedLine.split("=");
                if (key && value) {
                    envVars[key.trim()] = value.trim();
                }
            }
        });

        return envVars;
    }
    return {};
}

// Combinar variables de entorno del sistema y del archivo
function getEnvironmentVariables() {
    const fileEnvs = loadEnvFromFile();

    return {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || fileEnvs.FIREBASE_API_KEY || "",
        FIREBASE_AUTH_DOMAIN:
            process.env.FIREBASE_AUTH_DOMAIN || fileEnvs.FIREBASE_AUTH_DOMAIN || "",
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || fileEnvs.FIREBASE_PROJECT_ID || "",
        FIREBASE_STORAGE_BUCKET:
            process.env.FIREBASE_STORAGE_BUCKET || fileEnvs.FIREBASE_STORAGE_BUCKET || "",
        FIREBASE_MESSAGING_SENDER_ID:
            process.env.FIREBASE_MESSAGING_SENDER_ID || fileEnvs.FIREBASE_MESSAGING_SENDER_ID || "",
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || fileEnvs.FIREBASE_APP_ID || "",
        FIREBASE_MEASUREMENT_ID:
            process.env.FIREBASE_MEASUREMENT_ID || fileEnvs.FIREBASE_MEASUREMENT_ID || "",
    };
}

// Generar el script para inyectar en index.html
function generateEnvScript() {
    const envVars = getEnvironmentVariables();

    return `<script>
  (function(window) {
    window['ENV'] = ${JSON.stringify(envVars, null, 2)};
  })(this);
</script>`;
}

// Inyectar variables en index.html
function injectEnvIntoIndex() {
    const distPath = path.join(__dirname, "..", "dist", "prompt-dict", "browser");
    const indexPath = path.join(distPath, "index.html");

    if (!fs.existsSync(indexPath)) {
        console.error("❌ index.html no encontrado en dist/prompt-dict/browser/");
        console.log("📂 Buscando en rutas alternativas...");

        // Intentar rutas alternativas
        const altPaths = [
            path.join(__dirname, "..", "dist", "prompt-dict", "index.html"),
            path.join(__dirname, "..", "dist", "index.html"),
        ];

        let found = false;
        for (const altPath of altPaths) {
            if (fs.existsSync(altPath)) {
                console.log(`✅ Encontrado en: ${altPath}`);
                injectEnvIntoFile(altPath);
                found = true;
                break;
            }
        }

        if (!found) {
            process.exit(1);
        }
        return;
    }

    injectEnvIntoFile(indexPath);
}

function injectEnvIntoFile(indexPath) {
    let indexContent = fs.readFileSync(indexPath, "utf8");
    const envScript = generateEnvScript();

    // Inyectar el script antes del cierre de </head>
    indexContent = indexContent.replace("</head>", `  ${envScript}\n</head>`);

    fs.writeFileSync(indexPath, indexContent, "utf8");
    console.log("✅ Variables de entorno inyectadas en index.html");
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    injectEnvIntoIndex();
}

module.exports = { injectEnvIntoIndex, getEnvironmentVariables };
