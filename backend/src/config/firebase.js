import { cert, initializeApp, getApps } from "firebase-admin/app";
import fs from "fs";
import path from "path";

let serviceAccount = null;

// 1. In production (e.g. Vercel), read from FIREBASE_SERVICE_ACCOUNT environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error(
      "Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:",
      err.message,
    );
  }
} else {
  // 2. In local development, read from local serviceAccountKey.json if it exists
  const keyPaths = [
    path.resolve(process.cwd(), "serviceAccountKey.json"),
    path.resolve(process.cwd(), "backend/serviceAccountKey.json"),
    path.resolve(import.meta.dirname, "../../serviceAccountKey.json"),
  ];

  for (const p of keyPaths) {
    if (fs.existsSync(p)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(p, "utf-8"));
        break;
      } catch (err) {
        console.error(`Error reading service account file from ${p}:`, err.message);
      }
    }
  }
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(
        serviceAccount ? { credential: cert(serviceAccount) } : undefined,
      );

export default app;
