import { DEFAULT_VARS, KEYS } from "../config/constants";

export function createDefaultVars() {
  return { ...DEFAULT_VARS };
}

export function normalizeVars(input) {
  const defaults = createDefaultVars();
  const source = input && typeof input === "object" ? input : {};

  return KEYS.reduce((acc, key) => {
    const value = Number(source[key]);
    acc[key] = Number.isFinite(value) ? value : defaults[key];
    return acc;
  }, {});
}
