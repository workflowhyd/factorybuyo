"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const slides = [
  {
    image: "/hero-slide-1.jpg",
    alt: "Premium tech, tested and trusted",
    eyebrow: "Handpicked for India",
    headline: ["Premium tech,", "honest prices."],
    sub: "Hand-checked gaming laptops and certified refurbished deals, reserved online and confirmed on WhatsApp.",
    primaryCta: { label: "Shop Gaming Laptops", href: "/gaming-laptops" },
    secondaryCta: { label: "Shop Refurbished", href: "/refurbished-laptops" },
  },
  {
    image: "/hero-slide-2.jpg",
    alt: "Renewed electronics, like new for less",
    eyebrow: "Certified & tested",
    headline: ["Like new,", "half the price."],
    sub: "40-point tested refurbished laptops, hand-picked and backed by up to 6 months' warranty.",
    primaryCta: { label: "Shop Refurbished", href: "/refurbished-laptops" },
    secondaryCta: { label: "Shop Gaming Laptops", href: "/gaming-laptops" },
  },
  {
    image: "/gaming-laptops-banner.jpg",
    alt: "Popular gaming laptops — high performance, epic gameplay",
    eyebrow: "Limited time",
    headline: ["Gaming laptops,", "unbeatable deals."],
    sub: "Play more, pay less — ASUS, Acer and Lenovo gaming rigs at prices that don't hurt.",
    primaryCta: { label: "Shop Gaming Laptops", href: "/gaming-laptops" },
    secondaryCta: null,
    overlay: "linear-gradient(180deg,rgba(10,4,24,0.35)_0%,rgba(10,4,24,0.55)_100%)",
    textPanel: true,
  },
];

const DEFAULT_OVERLAY =
  "linear-gradient(100deg,rgba(15,5,32,0.9)_10%,rgba(58,14,109,0.55)_45%,rgba(58,14,109,0.15)_80%)";

const SLIDE_DURATION = 5500;

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-4 sm:pb-14 sm:pt-6">
      <div className="relative isolate">
        <div
          aria-hidden
          className="absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(55%_55%_at_25%_15%,rgba(230,18,125,0.35),transparent_70%),radial-gradient(50%_50%_at_85%_85%,rgba(91,31,143,0.4),transparent_70%)] blur-3xl"
        />

        <div className="relative h-[300px] overflow-hidden rounded-3xl shadow-[0_30px_70px_-20px_rgba(58,14,109,0.45)] sm:h-[380px] md:h-[480px] lg:h-[550px]">
          <AnimatePresence>
            <motion.div
              key={slide.image}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: 1.09 }}
                transition={{ duration: (SLIDE_DURATION + 1200) / 1000, ease: "linear" }}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  unoptimized
                  priority={index === 0}
                  className="object-cover object-center"
                />
              </motion.div>
              <div
                className="absolute inset-0"
                style={{ background: slide.overlay ?? DEFAULT_OVERLAY }}
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex h-full items-center px-5 pb-7 sm:px-10 sm:pb-0 md:px-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className={`max-w-md ${
                  slide.textPanel
                    ? "rounded-2xl bg-black/55 p-4 backdrop-blur-md sm:p-6"
                    : ""
                }`}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-xs"
                >
                  {slide.eyebrow}
                </motion.p>
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
                  className="mt-2 text-[26px] font-bold leading-[1.15] tracking-tight text-white sm:mt-3 sm:text-4xl sm:leading-tight md:text-5xl"
                >
                  {slide.headline[0]}
                  <br />
                  {slide.headline[1]}
                </motion.h1>
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
                  className="mt-2.5 text-[13px] leading-relaxed text-white/80 sm:mt-4 sm:text-base"
                >
                  {slide.sub}
                </motion.p>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
                  className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3"
                >
                  <Link
                    href={slide.primaryCta.href}
                    className="group relative overflow-hidden rounded-full bg-brand px-6 py-3 text-center text-sm font-bold text-white shadow-[0_8px_24px_-6px_rgba(230,18,125,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-6px_rgba(230,18,125,0.75)] active:translate-y-0 sm:inline-block"
                  >
                    <span className="relative z-10">{slide.primaryCta.label}</span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                  </Link>
                  {slide.secondaryCta && (
                    <Link
                      href={slide.secondaryCta.href}
                      className="rounded-full border border-white/40 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0 sm:inline-block"
                    >
                      {slide.secondaryCta.label}
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-7">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
