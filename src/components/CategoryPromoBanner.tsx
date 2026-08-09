"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import StorageImage from "@/components/StorageImage";

export default function CategoryPromoBanner({ category }: { category: "gaming" | "refurbished" }) {
  const promos = useQuery(api.promos.listActive, { category });

  if (!promos || promos.length === 0) return null;

  if (promos.length === 1) {
    const p = promos[0];
    return (
      <Link
        href={p.ctaHref || "#"}
        className="group relative mb-8 block h-40 overflow-hidden rounded-2xl sm:h-56"
      >
        <StorageImage
          src={p.image}
          alt={p.headline}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <p className="text-lg font-bold text-white sm:text-2xl">{p.headline}</p>
          {p.sub && <p className="mt-1 text-sm text-white/80">{p.sub}</p>}
          {p.ctaText && (
            <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-900">
              {p.ctaText}
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {promos.map((p) => (
        <Link
          key={p._id}
          href={p.ctaHref || "#"}
          className="group relative h-40 overflow-hidden rounded-2xl"
        >
          <StorageImage
            src={p.image}
            alt={p.headline}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-sm font-bold text-white">{p.headline}</p>
            {p.ctaText && <p className="mt-0.5 text-xs text-white/80">{p.ctaText}</p>}
          </div>
        </Link>
      ))}
    </div>
  );
}
