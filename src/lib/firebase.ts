// src/lib/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// ---------- CONFIG ----------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// ---------- RUNTIME CHECK ----------
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.warn(
    `Firebase config missing for keys: ${missingKeys.join(
      ", "
    )}. Make sure NEXT_PUBLIC_FIREBASE_* vars are set in .env.local`
  );
}

// ---------- INITIALIZE FIREBASE ----------
export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(firebaseApp);
