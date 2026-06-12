export function fmtNZD(value) {
  const roundedUp = Math.ceil(Number(value) || 0);

  return roundedUp.toLocaleString("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function fmtVar(key, value) {
  if (key === "M") {
    return value.toLocaleString("en-NZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return fmtNZD(value);
}
