"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Client-side Firebase app — used ONLY for the admin login call
 * (signInWithEmailAndPassword). All data reads/writes go through the server
 * (Admin SDK), so the client SDK deliberately does not expose Firestore/Storage.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let cachedApp: FirebaseApp | undefined;

export function getClientApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return cachedApp;
}

export function getClientAuth(): Auth {
  return getAuth(getClientApp());
}
