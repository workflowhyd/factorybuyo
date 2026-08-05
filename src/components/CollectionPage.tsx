"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";

export default function CollectionPage({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: "gaming" | "refurbished";
}) {
  const products = useQuery(api.products.list, { category });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>
      </div>

      {products === undefined && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      )}

      {products && products.length === 0 && (
        <p className="text-sm text-slate-500">
          New stock arriving soon — reserve on WhatsApp to be notified first.
        </p>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
