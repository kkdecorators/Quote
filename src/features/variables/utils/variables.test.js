import { describe, expect, it } from "vitest";
import { createDefaultVars, normalizeVars } from "./variables";

describe("variables utils", () => {
  it("creates defaults for all keys", () => {
    const defaults = createDefaultVars();
    expect(Object.keys(defaults)).toHaveLength(13);
    expect(defaults.A).toBe(1);
    expect(defaults.M).toBe(1.2);
  });

  it("normalizes invalid values to defaults", () => {
    const normalized = normalizeVars({ A: "3", B: "bad", M: 1.2 });

    expect(normalized.A).toBe(3);
    expect(normalized.B).toBe(2);
    expect(normalized.M).toBe(1.2);
    expect(normalized.L).toBe(12);
  });
});
