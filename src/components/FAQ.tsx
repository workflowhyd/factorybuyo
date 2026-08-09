"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Reveal from "@/components/motion/Reveal";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export default function FAQ() {
  const faqs = useQuery(api.faq.list, {});
  const settings = useQuery(api.faq.getSettings, {});
  const visible = faqs?.filter((f) => !f.hidden);

  // null = no explicit choice yet, fall back to the configured default (or
  // first item); "" = user explicitly collapsed everything (mobile only).
  const [openId, setOpenId] = useState<string | null>(null);

  if (visible && visible.length === 0) return null;

  const defaultId =
    settings?.defaultOpenId && visible?.some((f) => f._id === settings.defaultOpenId)
      ? settings.defaultOpenId
      : visible?.[0]?._id;
  const selectedId = openId === null ? (defaultId ?? null) : openId || null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <Reveal className="mb-8 text-center sm:mb-12">
        {settings === undefined ? (
          <div className="mx-auto max-w-md space-y-2.5">
            <div className="mx-auto h-6 w-56 animate-pulse rounded bg-slate-100" />
            <div className="mx-auto h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {settings?.heading ?? "Frequently asked questions"}
            </h2>
            {settings?.intro && (
              <p className="mx-auto mt-2.5 max-w-xl text-sm text-slate-500 sm:text-base">
                {settings.intro}
              </p>
            )}
          </>
        )}
      </Reveal>

      {visible === undefined && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {visible && visible.length > 0 && (
        <>
          {/* Desktop: two-panel */}
          <div className="hidden gap-8 md:grid md:grid-cols-[minmax(0,320px)_1fr]">
            <div className="space-y-1.5">
              {visible.map((faq) => (
                <button
                  key={faq._id}
                  onClick={() => setOpenId(faq._id)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    selectedId === faq._id
                      ? "bg-brand/10 text-brand"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {faq.question}
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 sm:p-8">
              {visible
                .filter((faq) => faq._id === selectedId)
                .map((faq) => (
                  <div key={faq._id}>
                    <p className="text-base font-bold text-slate-900">{faq.question}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Mobile: accordion */}
          <div className="space-y-2.5 md:hidden">
            {visible.map((faq) => {
              const isOpen = selectedId === faq._id;
              return (
                <div
                  key={faq._id}
                  className="overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? "" : faq._id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    {faq.question}
                    {isOpen ? (
                      <Minus className="h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4 flex-shrink-0 text-slate-400" strokeWidth={2.5} />
                    )}
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 text-[13px] leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {settings?.ctaEnabled && (
        <p className="mt-8 text-center text-sm text-slate-500">
          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand hover:underline"
          >
            {settings.ctaText}
          </a>
        </p>
      )}
    </section>
  );
}
