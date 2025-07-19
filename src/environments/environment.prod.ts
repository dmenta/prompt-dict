export const environment = {
    production: true,
    firebase: {
        apiKey: (globalThis as any)?.["ENV"]?.["FIREBASE_API_KEY"] || "",
        authDomain: (globalThis as any)?.["ENV"]?.["FIREBASE_AUTH_DOMAIN"] || "",
        projectId: (globalThis as any)?.["ENV"]?.["FIREBASE_PROJECT_ID"] || "",
        storageBucket: (globalThis as any)?.["ENV"]?.["FIREBASE_STORAGE_BUCKET"] || "",
        messagingSenderId: (globalThis as any)?.["ENV"]?.["FIREBASE_MESSAGING_SENDER_ID"] || "",
        appId: (globalThis as any)?.["ENV"]?.["FIREBASE_APP_ID"] || "",
        measurementId: (globalThis as any)?.["ENV"]?.["FIREBASE_MEASUREMENT_ID"] || "",
    },
};
