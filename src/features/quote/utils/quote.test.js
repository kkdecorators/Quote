import { describe, expect, it } from "vitest";
import { computeQuote } from "./quote";

describe("computeQuote", () => {
  it("computes expected quote values from vars", () => {
    const vars = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
      J: 10,
      K: 11,
      L: 12,
      M: 1.5,
    };

    const result = computeQuote(2, 3, vars);

    expect(result.costEx).toBeCloseTo(411);
    expect(result.costGST).toBeCloseTo(61.65);
    expect(result.costInc).toBeCloseTo(472.65);
    expect(result.sellEx).toBeCloseTo(616.5);
    expect(result.sellGST).toBeCloseTo(92.475);
    expect(result.sellInc).toBeCloseTo(708.975);
  });

  it("falls back missing vars to canonical defaults", () => {
    const result = computeQuote(1, 1, { M: 2 });

    expect(result.costEx).toBeCloseTo(112);
    expect(result.sellEx).toBeCloseTo(224);
    expect(result.sellInc).toBeCloseTo(257.6);
  });
});
