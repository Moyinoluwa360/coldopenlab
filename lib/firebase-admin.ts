import "server-only";

import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Server-side Firebase Admin SDK, initialized lazily.
 *
 * Initialization is deferred until the first getter call so that merely
 * importing this module never throws when env vars are absent (keeps
 * `next build` and unrelated routes working before Firebase is configured).
 * Used for all public reads, admin writes, image uploads, and verifying the
 * admin session cookie. Never import this from client code.
 */

function readConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys are stored with literal "\n" sequences in env; restore newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  return { projectId, clientEmail, privateKey, storageBucket };
}

export function isAdminConfigured(): boolean {
  const { projectId, clientEmail, privateKey } = readConfig();
  return Boolean(projectId && clientEmail && privateKey);
}

function getAdminApp(): App {
  if (getApps().length) return getApp();
  const { projectId, clientEmail, privateKey, storageBucket } = readConfig();
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local (see .env.example)."
    );
  }
  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminBucket() {
  const { storageBucket } = readConfig();
  return getStorage(getAdminApp()).bucket(storageBucket);
}
