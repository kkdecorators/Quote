export function fmtNZD(value) {
  return value.toLocaleString("en-NZ", {
    style: "currency",
    currency: "NZD",
    minimumFractionDigits: 2,
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
