import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseApp } from "../../../shared/utils/firebaseApp";
import { normalizeVars } from "./variables";

const varsCollection = import.meta.env.VITE_FIREBASE_VARS_COLLECTION || "Quote_App";
const varsDocId = import.meta.env.VITE_FIREBASE_VARS_DOC_ID || "Shared_Variables";

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
    return { ok: false, code: "sync/not-configured" };
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

    return { ok: true };
  } catch (error) {
    return { ok: false, code: error?.code || "sync/unknown" };
  }
}
