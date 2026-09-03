const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => zarFormatter.format(Number(value) || 0);