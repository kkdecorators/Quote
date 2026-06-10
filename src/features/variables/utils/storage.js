import { VARS_STORAGE_KEY } from "../config/constants";
import { createDefaultVars, normalizeVars } from "./variables";

export function loadVars() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VARS_STORAGE_KEY));
    return normalizeVars(parsed);
  } catch {
    return createDefaultVars();
  }
}

export function saveVars(vars) {
  localStorage.setItem(VARS_STORAGE_KEY, JSON.stringify(normalizeVars(vars)));
}
