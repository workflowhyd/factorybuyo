"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/hero-slide-1.jpg",
    href: "/hot-deals",
    alt: "Premium tech, zero price tag — love it or return it, absolutely free",
  },
  {
    image: "/hero-slide-2.jpg",
    href: "/refurbished-laptops",
    alt: "Renewed electronics, like new but way cheaper — save up to 70%",
  },
];

function subscribe(emblaApi: EmblaCarouselType | undefined, callback: () => void) {
  if (!emblaApi) return () => {};
  emblaApi.on("select", callback).on("reInit", callback);
  return () => {
    emblaApi.off("select", callback).off("reInit", callback);
  };
}

export default function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);

  const selectedIndex = useSyncExternalStore(
    useCallback((cb) => subscribe(emblaApi, cb), [emblaApi]),
    () => emblaApi?.selectedScrollSnap() ?? 0,
    () => 0
  );

  return (
    <section className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <Link
              key={slide.image}
              href={slide.href}
              className="relative aspect-[16/10] w-full flex-[0_0_100%] sm:aspect-[21/8]"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                unoptimized
                priority
                className="object-cover object-left sm:object-center"
              />
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-5">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
