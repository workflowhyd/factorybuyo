export type Region = "IN" | "SG";

const CURRENCY_BY_REGION: Record<Region, string> = {
  IN: "INR",
  SG: "SGD",
};

const LOCALE_BY_REGION: Record<Region, string> = {
  IN: "en-IN",
  SG: "en-SG",
};

export function formatPrice(amount: number, region: Region = "IN"): string {
  return new Intl.NumberFormat(LOCALE_BY_REGION[region], {
    style: "currency",
    currency: CURRENCY_BY_REGION[region],
    maximumFractionDigits: 0,
  }).format(amount);
}

export function discountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
