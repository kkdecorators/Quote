import { normalizeVars } from "../../variables/utils/variables";

export function computeQuote(meters, quantity, vars) {
  const v = normalizeVars(vars);

  const f1 = meters * (v.A + v.B + v.C * 2 + v.D * 4) * quantity;
  const f2 = quantity * (v.E + v.F + v.G + v.H + (v.I + v.J) * 2);
  const f3 = quantity * (v.L + v.K);

  const totalCostExGST = f1 + f2 + f3;
  const gstRate = 0.15;
  const costGST = totalCostExGST * gstRate;
  const costIncGST = totalCostExGST + costGST;
  const sellExGST = totalCostExGST * v.M;
  const sellGST = sellExGST * gstRate;
  const sellIncGST = sellExGST + sellGST;

  return {
    costEx: totalCostExGST,
    costGST,
    costInc: costIncGST,
    sellEx: sellExGST,
    sellGST,
    sellInc: sellIncGST,
  };
}
