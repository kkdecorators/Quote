import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirebaseApp } from "../../../shared/utils/firebaseApp";

function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  return getAuth(app);
}

export function subscribeAuthState(callback) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

export async function loginWithFirebase(email, password) {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { ok: false, code: "auth/not-configured" };
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (error) {
    return { ok: false, code: error?.code || "auth/unknown" };
  }
}

export async function sendResetEmail(email) {
  const auth = getFirebaseAuth();
  if (!auth) {
    return { ok: false, code: "auth/not-configured" };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (error) {
    return { ok: false, code: error?.code || "auth/unknown" };
  }
}

export async function logoutFromFirebase() {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }

  try {
    await signOut(auth);
  } catch {
    // Ignore logout errors to keep UX predictable.
  }
}
