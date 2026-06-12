import { beforeEach, describe, expect, it } from "vitest";
import { loadVars, saveVars } from "./storage";

function createLocalStorageMock() {
  let store = {};

  return {
    clear() {
      store = {};
    },
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    removeItem(key) {
      delete store[key];
    },
    setItem(key, value) {
      store[key] = String(value);
    },
  };
}

describe("storage utils", () => {
  beforeEach(() => {
    globalThis.localStorage = createLocalStorageMock();
  });

  it("saves then loads normalized vars", () => {
    saveVars({ A: 5, M: 1.3, B: "bad" });
    const loaded = loadVars();

    expect(loaded.A).toBe(5);
    expect(loaded.B).toBe(2);
    expect(loaded.M).toBe(1.3);
  });

  it("returns defaults for invalid JSON", () => {
    localStorage.setItem("vars", "not-json");
    const loaded = loadVars();

    expect(loaded.A).toBe(1);
    expect(loaded.M).toBe(1.2);
  });
});
