"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import StorageImage from "@/components/StorageImage";
import { formatINR, discountPercent } from "@/lib/format";
import type { Doc } from "../../convex/_generated/dataModel";

export default function ProductCard({ product }: { product: Doc<"products"> }) {
  const discount = discountPercent(product.price, product.originalPrice);
  const image = product.images[0];
  const [saved, setSaved] = useState(false);

  return (
    <Link
      href={`/product?slug=${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {image && (
          <StorageImage
            src={image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save for later"}
          onClick={(e) => {
            e.preventDefault();
            setSaved((v) => !v);
          }}
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm transition-colors hover:text-brand"
        >
          <Heart
            className={`h-4 w-4 ${saved ? "fill-brand text-brand" : ""}`}
            strokeWidth={1.8}
          />
        </button>
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.conditionGrade && (
          <span className="absolute right-3 top-11 rounded-full bg-slate-900/90 px-2 py-1 text-xs font-semibold text-white">
            {product.conditionGrade}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-bold text-slate-700">
            Sold Out
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {product.brand}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900 line-clamp-2">{product.name}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
