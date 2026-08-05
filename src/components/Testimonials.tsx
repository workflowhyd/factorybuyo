"use client";

import { Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Carousel from "@/components/Carousel";
import Reveal from "@/components/motion/Reveal";

const avatarColors = ["#5b1f8f", "#e6127d", "#0f172a", "#0891b2"];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-brand text-brand" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const testimonials = useQuery(api.testimonials.list, {});

  if (testimonials === undefined || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <Reveal>
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:mb-8 sm:text-sm">
          What our customers have to say
        </h2>
      </Reveal>
      <Carousel>
        {testimonials.map((t, i) => (
          <div
            key={t._id}
            className="w-[230px] flex-[0_0_auto] rounded-2xl bg-[#faf4fd] p-5 shadow-[0_4px_16px_-8px_rgba(58,14,109,0.15)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(58,14,109,0.28)] sm:w-[270px] sm:p-6"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white shadow-sm sm:h-12 sm:w-12 sm:text-lg"
              style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
            >
              {t.name.charAt(0).toUpperCase()}
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900 sm:mt-4">{t.name}</p>
            <div className="mt-1.5">
              <StarRow rating={t.rating} />
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600 sm:mt-3 sm:text-sm">
              {t.quote}
            </p>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
