import { getApp, getApps, initializeApp } from "firebase/app";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { normalizeVars } from "./variables";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const varsCollection = import.meta.env.VITE_FIREBASE_VARS_COLLECTION || "quoteApp";
const varsDocId = import.meta.env.VITE_FIREBASE_VARS_DOC_ID || "sharedVariables";

function hasFirebaseConfig() {
  return (
    Boolean(firebaseConfig.apiKey) &&
    Boolean(firebaseConfig.authDomain) &&
    Boolean(firebaseConfig.projectId) &&
    Boolean(firebaseConfig.appId)
  );
}

function getDb() {
  if (!hasFirebaseConfig()) {
    return null;
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function loadSyncedVars() {
  const db = getDb();
  if (!db) {
    return null;
  }

  try {
    const varsRef = doc(db, varsCollection, varsDocId);
    const snapshot = await getDoc(varsRef);
    if (!snapshot.exists()) {
      return null;
    }

    return normalizeVars(snapshot.data()?.vars);
  } catch {
    return null;
  }
}

export async function saveSyncedVars(vars) {
  const db = getDb();
  if (!db) {
    return false;
  }

  try {
    const varsRef = doc(db, varsCollection, varsDocId);
    await setDoc(
      varsRef,
      {
        vars: normalizeVars(vars),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch {
    return false;
  }
}
