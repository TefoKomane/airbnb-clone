const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

// use the env var if set, otherwise fall back to a current reference rate
const usdToZarRate = Number(import.meta.env.VITE_USD_TO_ZAR_RATE) || 18.5;

export const formatCurrency = (value, sourceCurrency = "USD") => {
  const amount = Number(value) || 0;
  return zarFormatter.format(sourceCurrency === "USD" ? amount * usdToZarRate : amount);
};