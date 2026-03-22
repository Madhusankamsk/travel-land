export function formatTripPrice(amount: number, currency: string) {
  return amount.toLocaleString("en-GB", {
    style: "currency",
    currency: currency || "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
