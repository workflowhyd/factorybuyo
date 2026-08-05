"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const products = useQuery(api.products.list, {});

  const results = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
      </div>

      {!q && <p className="text-sm text-slate-500">Type something in the search bar above.</p>}

      {q && products === undefined && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {q && results && results.length === 0 && (
        <p className="text-sm text-slate-500">
          No laptops matched &quot;{q}&quot; — try a different brand or model name.
        </p>
      )}

      {q && results && results.length > 0 && (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
