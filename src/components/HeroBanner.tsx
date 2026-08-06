"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const slides = [
  {
    image: "/hero-slide-1.jpg",
    alt: "Gaming laptops sale — play more, pay less",
    href: "/gaming-laptops",
  },
  {
    image: "/hero-slide-2.jpg",
    alt: "Pre-owned laptops — great laptops, greater value",
    href: "/preowned-laptops",
  },
];

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

        <div className="relative aspect-[15/8] w-full overflow-hidden rounded-3xl shadow-[0_30px_70px_-20px_rgba(58,14,109,0.45)]">
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
                animate={{ scale: 1.04 }}
                transition={{ duration: (SLIDE_DURATION + 1200) / 1000, ease: "linear" }}
              >
                <Link href={slide.href} className="absolute inset-0" aria-label={slide.alt}>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    unoptimized
                    priority={index === 0}
                    className="object-cover object-center"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-5">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
