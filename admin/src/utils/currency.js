const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const usdToZarRate = Number(import.meta.env.VITE_USD_TO_ZAR_RATE || 16.0944);

export const formatCurrency = (value, sourceCurrency = "USD") => {
  const amount = Number(value) || 0;
  return zarFormatter.format(sourceCurrency === "USD" ? amount * usdToZarRate : amount);
};