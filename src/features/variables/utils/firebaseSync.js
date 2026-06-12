import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseApp } from "../../../shared/utils/firebaseApp";
import { normalizeVars } from "./variables";

const varsCollection = import.meta.env.VITE_FIREBASE_VARS_COLLECTION || "quoteApp";
const varsDocId = import.meta.env.VITE_FIREBASE_VARS_DOC_ID || "sharedVariables";

function getDb() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

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
