"use client";

import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const avatarColors = ["#5b1f8f", "#e6127d", "#0f172a", "#0891b2"];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-brand" : "fill-slate-200"}`}
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const testimonials = useQuery(api.testimonials.list, {});
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (testimonials === undefined || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="mb-6 text-lg font-extrabold uppercase tracking-wide text-slate-900 sm:text-xl">
        What our customers have to say
      </h2>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t, i) => (
          <div
            key={t._id}
            className="w-[260px] flex-shrink-0 snap-start rounded-xl bg-[#faf4fd] p-5"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
            >
              {t.name.charAt(0).toUpperCase()}
            </div>
            <p className="mt-4 text-sm font-bold text-slate-900">{t.name}</p>
            <div className="mt-1">
              <StarRow rating={t.rating} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{t.quote}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
