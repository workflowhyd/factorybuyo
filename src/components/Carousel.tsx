"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

function subscribe(emblaApi: EmblaCarouselType | undefined, callback: () => void) {
  if (!emblaApi) return () => {};
  emblaApi.on("select", callback).on("reInit", callback);
  return () => {
    emblaApi.off("select", callback).off("reInit", callback);
  };
}

export default function Carousel({ children }: { children: React.ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const canScrollPrev = useSyncExternalStore(
    useCallback((cb) => subscribe(emblaApi, cb), [emblaApi]),
    () => emblaApi?.canScrollPrev() ?? false,
    () => false
  );
  const canScrollNext = useSyncExternalStore(
    useCallback((cb) => subscribe(emblaApi, cb), [emblaApi]),
    () => emblaApi?.canScrollNext() ?? false,
    () => false
  );

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">{children}</div>
      </div>

      {canScrollPrev && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-brand lg:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canScrollNext && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:text-brand lg:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
