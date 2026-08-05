"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { motion } from "motion/react";
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
      className="group block overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_-4px_rgba(15,23,42,0.1)] ring-1 ring-slate-100 transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_48px_-18px_rgba(58,14,109,0.28)] hover:ring-slate-200"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        {image && (
          <StorageImage
            src={image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        )}

        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save for later"}
          onClick={(e) => {
            e.preventDefault();
            setSaved((v) => !v);
          }}
          className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 active:scale-90"
        >
          <motion.span
            animate={saved ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex"
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-brand text-brand" : ""}`} strokeWidth={1.8} />
          </motion.span>
        </button>

        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}
        {product.conditionGrade && (
          <span className="absolute right-3 top-11 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {product.conditionGrade}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/85 text-sm font-bold text-slate-700 backdrop-blur-sm">
            Sold Out
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 justify-center pb-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-sm">
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            View details
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {product.brand}
        </p>
        <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
          {product.name}
        </p>
        <div className="mt-2.5 flex items-baseline gap-2">
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
