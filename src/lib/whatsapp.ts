import { formatPrice, type Region } from "./format";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type ReserveProduct = {
  name: string;
  price: number;
  slug: string;
  conditionGrade?: string;
};

export function buildReserveWhatsAppLink(
  product: ReserveProduct,
  chosenCondition?: string,
  region: Region = "IN"
) {
  const lines = [
    `Hi FactoryBuyo, I'd like to reserve this laptop:`,
    ``,
    `*${product.name}*`,
    `Price: ${formatPrice(product.price, region)}`,
  ];
  const condition = chosenCondition ?? product.conditionGrade;
  if (condition) {
    lines.push(`Condition: ${condition}`);
  }
  if (typeof window !== "undefined") {
    lines.push(`Link: ${window.location.origin}/product?slug=${product.slug}`);
  }
  lines.push(``, `Please let me know availability and next steps.`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function buildGeneralWhatsAppLink() {
  const text = encodeURIComponent("Hi FactoryBuyo, I have a question about your laptops.");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export const isWhatsAppConfigured = WHATSAPP_NUMBER.length > 0;
