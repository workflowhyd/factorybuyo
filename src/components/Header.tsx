"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import CategoryBanner from "@/components/CategoryBanner";
import MobileMenu from "@/components/MobileMenu";
import PredictiveSearch from "@/components/PredictiveSearch";
import { useRegion } from "@/context/RegionContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { settings, whatsappNumber } = useRegion();

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      setScrolled((prev) => {
        const y = window.scrollY;
        // Hysteresis: different thresholds for entering/leaving the
        // scrolled state so hovering near one value doesn't flicker.
        return prev ? y > 8 : y > 32;
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`overflow-hidden bg-brand px-4 text-center text-xs font-semibold text-white transition-all duration-300 ease-out sm:text-sm ${
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-12 py-2 opacity-100"
        }`}
      >
        {settings?.bannerText ?? "Reserve your laptop online, pay & collect at pickup — no card details needed."}
      </div>

      <div
        className={`border-b transition-all duration-300 ease-out ${
          scrolled
            ? "border-slate-200/60 bg-white/75 shadow-[0_1px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`mx-auto hidden max-w-6xl items-center gap-3 px-4 transition-all duration-300 ease-out sm:gap-4 md:flex ${
            scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
          }`}
        >
          <Link
            href="/"
            className={`relative flex-shrink-0 transition-all duration-300 ease-out ${
              scrolled ? "h-12 w-44 sm:h-10 sm:w-36" : "h-[78px] w-[272px] sm:h-16 sm:w-56"
            }`}
          >
            <Image
              src="/logo.png"
              alt="FactoryBuyo"
              fill
              unoptimized
              priority
              className="object-contain object-left"
            />
          </Link>

          <PredictiveSearch className="flex flex-1 max-w-md" />

          <a
            href={buildGeneralWhatsAppLink(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="ml-auto inline-flex flex-shrink-0 items-center justify-center rounded-full bg-whatsapp p-3 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>

        <div
          className={`mx-auto flex max-w-6xl items-center px-2 transition-all duration-300 ease-out md:hidden ${
            scrolled ? "py-1.5" : "py-2.5"
          }`}
        >
          <MobileMenu />

          <Link href="/" className="relative h-11 flex-1">
            <Image
              src="/logo.png"
              alt="FactoryBuyo"
              fill
              unoptimized
              priority
              className="object-contain object-center"
            />
          </Link>

          <a
            href={buildGeneralWhatsAppLink(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex-shrink-0 rounded-full bg-whatsapp p-2.5 text-white shadow-sm transition-transform active:scale-90"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="px-4 pb-3 md:hidden">
          <PredictiveSearch className="flex" />
        </div>
      </div>

      <CategoryBanner scrolled={scrolled} />
    </header>
  );
}
