import { formatPrice, type Region } from "./format";

const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type ReserveProduct = {
  name: string;
  price: number;
  slug: string;
  conditionGrade?: string;
};

export function buildReserveWhatsAppLink({
  product,
  chosenCondition,
  region = "IN",
  whatsappNumber,
  configLabel,
  sku,
}: {
  product: ReserveProduct;
  chosenCondition?: string;
  region?: Region;
  whatsappNumber?: string;
  configLabel?: string;
  sku?: string;
}) {
  const lines = [`Hi FactoryBuyo, I'd like to reserve this laptop:`, ``, `*${product.name}*`];
  if (configLabel) {
    lines.push(`Configuration: ${configLabel}`);
  }
  lines.push(`Price: ${formatPrice(product.price, region)}`);
  const condition = chosenCondition ?? product.conditionGrade;
  if (condition) {
    lines.push(`Condition: ${condition}`);
  }
  if (sku) {
    lines.push(`SKU: ${sku}`);
  }
  if (typeof window !== "undefined") {
    lines.push(`Link: ${window.location.origin}/product/${product.slug}`);
  }
  lines.push(``, `Please let me know availability and next steps.`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${whatsappNumber || DEFAULT_WHATSAPP_NUMBER}?text=${text}`;
}

export function buildGeneralWhatsAppLink(whatsappNumber?: string) {
  const text = encodeURIComponent("Hi FactoryBuyo, I have a question about your laptops.");
  return `https://wa.me/${whatsappNumber || DEFAULT_WHATSAPP_NUMBER}?text=${text}`;
}

export const isWhatsAppConfigured = DEFAULT_WHATSAPP_NUMBER.length > 0;
