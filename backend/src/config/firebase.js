import { cert, getApps, initializeApp } from "firebase-admin/app";

const serviceAccountConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            credential: cert(serviceAccountConfig),
        });


export default app