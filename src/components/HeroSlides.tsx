"use client";

import Image from "next/image";
import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";

const slides = [
  { image: "/placeholders/asus-rog-strix-g16.svg", label: "ASUS ROG Strix G16" },
  { image: "/placeholders/dell-latitude-7400.svg", label: "Dell Latitude 7400" },
  { image: "/placeholders/acer-predator-helios-neo-16.svg", label: "Acer Predator Helios Neo 16" },
  { image: "/placeholders/lenovo-thinkpad-x1-carbon-g6.svg", label: "Lenovo ThinkPad X1 Carbon Gen 6" },
];

function subscribe(emblaApi: EmblaCarouselType | undefined, callback: () => void) {
  if (!emblaApi) return () => {};
  emblaApi.on("select", callback).on("reInit", callback);
  return () => {
    emblaApi.off("select", callback).off("reInit", callback);
  };
}

export default function HeroSlides() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  ]);

  const selectedIndex = useSyncExternalStore(
    useCallback((cb) => subscribe(emblaApi, cb), [emblaApi]),
    () => emblaApi?.selectedScrollSnap() ?? 0,
    () => 0
  );

  return (
    <div className="md:hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.image} className="relative aspect-[4/3] w-full flex-[0_0_100%]">
              <Image
                src={slide.image}
                alt={slide.label}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,14,109,0)_45%,rgba(58,14,109,0.9)_100%)]" />
              <p className="absolute bottom-3 left-4 text-sm font-bold text-white">{slide.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 bg-[linear-gradient(135deg,#3a0e6d_0%,#7d1f83_50%,#e6127d_100%)] pb-4 pt-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
