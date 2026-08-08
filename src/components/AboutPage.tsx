"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Reveal from "@/components/motion/Reveal";
import WhyFactoryBuyo from "@/components/WhyFactoryBuyo";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export default function AboutPage() {
  const hero = useQuery(api.about.getHero, {});
  const panels = useQuery(api.about.listPanels, {});
  const visiblePanels = panels?.filter((p) => !p.hidden);

  return (
    <div>
      <div className="relative isolate overflow-hidden border-b border-slate-100">
        <div
          aria-hidden
          className="absolute -inset-x-20 -top-32 -z-10 h-72 rounded-[40px] bg-[radial-gradient(55%_55%_at_25%_15%,rgba(230,18,125,0.16),transparent_70%),radial-gradient(50%_50%_at_85%_85%,rgba(91,31,143,0.18),transparent_70%)] blur-3xl"
        />
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
          {hero === undefined ? (
            <div className="mx-auto max-w-xl space-y-3">
              <div className="mx-auto h-3 w-20 animate-pulse rounded bg-slate-100" />
              <div className="mx-auto h-8 w-72 animate-pulse rounded bg-slate-100" />
              <div className="mx-auto h-4 w-full animate-pulse rounded bg-slate-100" />
            </div>
          ) : (
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-purple sm:text-xs">
                {hero?.eyebrow ?? "About Us"}
              </p>
              <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-4xl">
                {hero?.title ?? "About FactoryBuyo"}
              </h1>
              {hero?.subtitle && (
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:mt-4 sm:text-base">
                  {hero.subtitle}
                </p>
              )}
            </Reveal>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <div className="space-y-10 sm:space-y-14">
          {visiblePanels === undefined &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2.5">
                <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
              </div>
            ))}

          {visiblePanels?.map((panel) => (
            <Reveal key={panel._id}>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {panel.title}
              </h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">{panel.body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <WhyFactoryBuyo />

      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
        <Reveal>
          <p className="text-sm text-slate-500">
            Have a question we haven&apos;t answered here?{" "}
            <a
              href={buildGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand hover:underline"
            >
              Ask us on WhatsApp
            </a>
            .
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gaming-laptops"
              className="group flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand"
            >
              Browse products
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/hot-deals"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-brand hover:text-brand"
            >
              View current deals
            </Link>
            <a
              href={buildGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:border-whatsapp hover:text-whatsapp"
            >
              Contact us on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
