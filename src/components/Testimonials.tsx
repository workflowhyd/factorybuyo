"use client";

import { Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Carousel from "@/components/Carousel";

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
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="mb-6 text-lg font-extrabold uppercase tracking-wide text-slate-900 sm:text-xl">
        What our customers have to say
      </h2>
      <Carousel>
        {testimonials.map((t, i) => (
          <div
            key={t._id}
            className="w-[260px] flex-[0_0_auto] rounded-xl bg-[#faf4fd] p-5"
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
      </Carousel>
    </section>
  );
}
