"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Reveal from "@/components/motion/Reveal";
import Carousel from "@/components/Carousel";
import StorageImage from "@/components/StorageImage";
import ProductCard from "@/components/ProductCard";

export default function BrandSwitcher() {
  const brands = useQuery(api.brands.list, {});
  const settings = useQuery(api.brands.getSettings, {});
  const visibleBrands = brands?.filter((b) => !b.hidden);

  const [activeId, setActiveId] = useState<Id<"brands"> | null>(null);
  const selectedId = activeId ?? visibleBrands?.[0]?._id ?? null;

  const products = useQuery(api.brands.productsForBrand, selectedId ? { brandId: selectedId } : "skip");

  if (visibleBrands && visibleBrands.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Reveal className="mb-5 flex items-end justify-between sm:mb-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-[28px]">
            {settings?.heading ?? "Shop by brand"}
          </h2>
          {settings?.intro && (
            <p className="mt-1.5 text-sm text-slate-500">{settings.intro}</p>
          )}
        </div>
        {settings?.ctaHref && (
          <Link
            href={settings.ctaHref}
            className="group flex flex-shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-900 transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white sm:px-4 sm:py-2"
          >
            {settings.ctaLabel ?? "See all"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        )}
      </Reveal>

      {visibleBrands === undefined && (
        <div className="mb-6 flex gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 w-28 flex-shrink-0 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {visibleBrands && visibleBrands.length > 0 && (
        <div className="mb-6 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3">
          {visibleBrands.map((brand) => (
            <button
              key={brand._id}
              onClick={() => setActiveId(brand._id)}
              className={`flex h-14 w-28 flex-shrink-0 items-center justify-center rounded-2xl border-2 p-2 transition-all duration-200 ${
                selectedId === brand._id
                  ? "border-brand bg-brand/5"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              aria-pressed={selectedId === brand._id}
              aria-label={`Show ${brand.name} laptops`}
            >
              <div className="relative h-full w-full">
                <StorageImage src={brand.logo} alt={brand.name} fill unoptimized className="object-contain" />
              </div>
            </button>
          ))}
        </div>
      )}

      {products === undefined && selectedId && (
        <div className="flex gap-3 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] w-[170px] flex-[0_0_auto] animate-pulse rounded-2xl bg-slate-100 sm:w-[220px]"
            />
          ))}
        </div>
      )}

      {products && products.length === 0 && (
        <p className="rounded-2xl bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
          Nothing in stock from this brand right now — check back soon, or{" "}
          <Link href="/search" className="font-semibold text-brand hover:underline">
            browse everything we have
          </Link>
          .
        </p>
      )}

      {products && products.length > 0 && (
        <Carousel>
          {products.map((product) => (
            <div key={product._id} className="w-[170px] flex-[0_0_auto] sm:w-[220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}
