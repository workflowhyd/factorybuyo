"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Check } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { formatINR, discountPercent } from "@/lib/format";
import WhatsAppReserveButton from "@/components/WhatsAppReserveButton";

const conditionDescriptions: Record<string, string> = {
  Good: "Visible signs of use — light scratches or marks possible. Fully tested and functional, 80%+ battery health.",
  "Very Good": "Minor wear only visible up close. Fully tested and functional, 85%+ battery health.",
  Excellent: "Minimal to no visible wear, close to like-new condition. Fully tested, 90%+ battery health.",
};

const specLabels: Record<string, string> = {
  cpu: "Processor",
  gpu: "Graphics",
  ram: "RAM",
  storage: "Storage",
  display: "Display",
};

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const product = useQuery(api.products.getBySlug, slug ? { slug } : "skip");
  const [activeImage, setActiveImage] = useState(0);

  if (!slug) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-slate-500">Product not found.</p>;
  }

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-16 text-slate-500">
        We couldn&apos;t find that laptop — it may have sold out. Browse our{" "}
        <a href="/gaming-laptops" className="text-brand underline">
          current lineup
        </a>
        .
      </p>
    );
  }

  const discount = discountPercent(product.price, product.originalPrice);
  const specs = Object.entries(product.specs).filter(([, value]) => value);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
            {product.images[activeImage] && (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-20 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? "border-brand" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {product.brand}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-brand px-2 py-1 text-xs font-bold text-white">
                -{discount}% vs new
              </span>
            )}
          </div>

          {product.conditionGrade && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-900">
                Condition: {product.conditionGrade}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {conditionDescriptions[product.conditionGrade]}
              </p>
            </div>
          )}

          {specs.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-slate-200 pt-6 text-sm">
              {specs.map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-slate-500">{specLabels[key] ?? key}</span>
                  <span className="font-medium text-slate-900">{value}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            {product.inStock ? (
              <WhatsAppReserveButton
                product={{
                  name: product.name,
                  price: product.price,
                  slug: product.slug,
                  conditionGrade: product.conditionGrade,
                }}
              />
            ) : (
              <div className="rounded-lg bg-slate-100 px-6 py-3 text-center text-sm font-semibold text-slate-500">
                Currently sold out
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-500">
            {[
              "6-month warranty",
              "Certified & tested",
              "Pan-India delivery",
              "Reserve, no card needed",
            ].map((item) => (
              <p key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-brand" strokeWidth={2.5} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
