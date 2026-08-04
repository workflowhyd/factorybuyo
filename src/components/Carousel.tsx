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
        <div className="flex gap-4">{children}</div>
      </div>

      {canScrollPrev && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-md transition-colors hover:bg-slate-50 lg:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canScrollNext && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-md transition-colors hover:bg-slate-50 lg:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
