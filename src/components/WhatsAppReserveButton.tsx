"use client";

import { buildReserveWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppReserveButton({
  product,
  chosenCondition,
}: {
  product: { name: string; price: number; slug: string; conditionGrade?: string };
  chosenCondition?: string;
}) {
  return (
    <a
      href={buildReserveWhatsAppLink(product, chosenCondition)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
    >
      Reserve via WhatsApp
    </a>
  );
}
