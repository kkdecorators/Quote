import { KEYS } from "../config/constants";

export function createDefaultVars() {
  return KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});
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
