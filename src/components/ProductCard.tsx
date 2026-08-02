"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatINR, discountPercent } from "@/lib/format";
import type { Doc } from "../../convex/_generated/dataModel";

function HeartIcon({ filled, ...props }: { filled: boolean } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.5-4.6-10-9.3C0.3 7.6 2 4 5.6 4c2 0 3.5 1 4.4 2.4C10.9 5 12.4 4 14.4 4 18 4 19.7 7.6 22 11.2c-2.5 4.7-10 9.3-10 9.3Z"
      />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Doc<"products"> }) {
  const discount = discountPercent(product.price, product.originalPrice);
  const image = product.images[0];
  const [saved, setSaved] = useState(false);

  return (
    <Link
      href={`/product?slug=${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {image && (
          <Image
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
          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow-sm hover:text-brand"
        >
          <HeartIcon filled={saved} className={`h-4 w-4 ${saved ? "text-brand" : ""}`} />
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
