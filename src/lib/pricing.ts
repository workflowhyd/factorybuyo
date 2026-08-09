import type { Region } from "@/lib/format";

type PricedProduct = {
  price: number;
  originalPrice?: number;
  priceSGD?: number;
  originalPriceSGD?: number;
};

export function getRegionalPrice(
  product: PricedProduct,
  region: Region
): { price: number; originalPrice?: number } {
  if (region === "SG" && product.priceSGD !== undefined) {
    return { price: product.priceSGD, originalPrice: product.originalPriceSGD };
  }
  return { price: product.price, originalPrice: product.originalPrice };
}

/** SG prices are always manually assigned, never auto-converted — so a
 * missing priceSGD means the product genuinely isn't offered in that
 * market, not just "no override set". Showing the INR number under an
 * SGD label would be a wrong price, not a fallback. */
export function isAvailableInRegion(product: PricedProduct, region: Region): boolean {
  return region !== "SG" || product.priceSGD !== undefined;
}
