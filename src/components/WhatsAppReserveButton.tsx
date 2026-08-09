"use client";

import { buildReserveWhatsAppLink } from "@/lib/whatsapp";
import { useRegion } from "@/context/RegionContext";

export default function WhatsAppReserveButton({
  product,
  chosenCondition,
  configLabel,
  sku,
}: {
  product: { name: string; price: number; slug: string; conditionGrade?: string };
  chosenCondition?: string;
  configLabel?: string;
  sku?: string;
}) {
  const { region, whatsappNumber } = useRegion();

  return (
    <a
      href={buildReserveWhatsAppLink({ product, chosenCondition, region, whatsappNumber, configLabel, sku })}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,211,102,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(37,211,102,0.65)] active:translate-y-0"
    >
      Reserve via WhatsApp
    </a>
  );
}
