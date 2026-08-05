"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { discountPercent } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

export default function HotDealsPage() {
  const products = useQuery(api.products.list, {});
  const deals = products?.filter((p) => discountPercent(p.price, p.originalPrice));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Hot Deals
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-500">
          Every laptop currently priced below its original listing — biggest discounts first.
        </p>
      </div>

      {products === undefined && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {deals && deals.length === 0 && (
        <p className="text-sm text-slate-500">No active discounts right now — check back soon.</p>
      )}

      {deals && deals.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {deals
            .slice()
            .sort(
              (a, b) =>
                (discountPercent(b.price, b.originalPrice) ?? 0) -
                (discountPercent(a.price, a.originalPrice) ?? 0)
            )
            .map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      )}
    </div>
  );
}
