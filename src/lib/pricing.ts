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
