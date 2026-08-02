"use client";

import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";

function ChevronIcon({ direction, ...props }: { direction: "left" | "right" } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
      />
    </svg>
  );
}

export default function ProductCarousel({
  title,
  href,
  category,
  promoHeadline,
  promoSub,
}: {
  title: string;
  href: string;
  category: "gaming" | "refurbished";
  promoHeadline: string;
  promoSub: string;
}) {
  const products = useQuery(api.products.list, { category });
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: "left" | "right") {
    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900 sm:text-xl">
          {title}
        </h2>
        <Link
          href={href}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:border-brand hover:text-brand"
        >
          See all
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link
            href={href}
            className="relative flex w-[260px] flex-shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl bg-[linear-gradient(135deg,#3a0e6d_0%,#7d1f83_50%,#e6127d_100%)] p-5 text-white"
          >
            <p className="text-xl font-extrabold leading-tight">{promoHeadline}</p>
            <p className="mt-2 text-sm text-white/80">{promoSub}</p>
          </Link>

          {products === undefined &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-[220px] flex-shrink-0 animate-pulse rounded-xl bg-slate-100"
              />
            ))}

          {products &&
            products.length > 0 &&
            products.slice(0, 8).map((product) => (
              <div key={product._id} className="w-[220px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
        </div>

        {products && products.length === 0 && (
          <p className="text-sm text-slate-500">New stock arriving soon — check back shortly.</p>
        )}

        {products && products.length > 3 && (
          <>
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy("left")}
              className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md hover:bg-slate-50 lg:flex"
            >
              <ChevronIcon direction="left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy("right")}
              className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md hover:bg-slate-50 lg:flex"
            >
              <ChevronIcon direction="right" className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
