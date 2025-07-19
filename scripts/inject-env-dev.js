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

// Inyectar variables en index.html del src (para desarrollo)
function injectEnvIntoDevIndex() {
    const srcIndexPath = path.join(__dirname, "..", "src", "index.html");

    if (!fs.existsSync(srcIndexPath)) {
        console.error("❌ src/index.html no encontrado");
        process.exit(1);
    }

    let indexContent = fs.readFileSync(srcIndexPath, "utf8");

    // Limpiar inyección previa si existe
    indexContent = indexContent.replace(
        /\s*<script>\s*\(function\(window\) \{[\s\S]*?\}\)\(this\);\s*<\/script>/g,
        ""
    );

    const envScript = generateEnvScript();

    // Inyectar el script antes del cierre de </head>
    indexContent = indexContent.replace("</head>", `  ${envScript}\n</head>`);

    fs.writeFileSync(srcIndexPath, indexContent, "utf8");
    console.log("✅ Variables de entorno inyectadas en src/index.html para desarrollo");
}

// Limpiar inyección en index.html del src
function cleanDevIndex() {
    const srcIndexPath = path.join(__dirname, "..", "src", "index.html");
    const templatePath = path.join(__dirname, "..", "src", "index.template.html");

    // Si existe el template, usarlo para restaurar
    if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, "utf8");
        fs.writeFileSync(srcIndexPath, templateContent, "utf8");
        console.log("✅ src/index.html restaurado desde template (listo para commit)");
        return;
    }

    // Fallback: limpiar manualmente si no hay template
    if (!fs.existsSync(srcIndexPath)) {
        return;
    }

    let indexContent = fs.readFileSync(srcIndexPath, "utf8");

    // Limpiar inyección si existe
    indexContent = indexContent.replace(
        /\s*<script>\s*\(function\(window\) \{[\s\S]*?\}\)\(this\);\s*<\/script>/g,
        ""
    );

    fs.writeFileSync(srcIndexPath, indexContent, "utf8");
    console.log("✅ Variables de entorno limpiadas de src/index.html");
}

// Ejecutar según el comando
if (require.main === module) {
    const command = process.argv[2];

    if (command === "dev") {
        injectEnvIntoDevIndex();
    } else if (command === "clean") {
        cleanDevIndex();
    } else {
        // Por defecto, inyectar en dist (como antes)
        const { injectEnvIntoIndex } = require("./inject-env");
        injectEnvIntoIndex();
    }
}

module.exports = { injectEnvIntoDevIndex, cleanDevIndex, getEnvironmentVariables };
