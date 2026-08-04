"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";

export default function ProductCarousel({
  title,
  href,
  category,
  promoHeadline,
  promoSub,
  promoImage,
}: {
  title: string;
  href: string;
  category: "gaming" | "refurbished";
  promoHeadline: string;
  promoSub: string;
  promoImage: string;
}) {
  const products = useQuery(api.products.list, { category });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900 sm:text-xl">
          {title}
        </h2>
        <Link
          href={href}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:border-brand hover:text-brand"
        >
          See all
        </Link>
      </div>

      {products && products.length === 0 ? (
        <p className="text-sm text-slate-500">New stock arriving soon — check back shortly.</p>
      ) : (
        <Carousel>
          <Link
            href={href}
            className="relative flex w-[260px] flex-[0_0_auto] flex-col justify-end overflow-hidden rounded-xl p-5 text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Image src={promoImage} alt="" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,14,109,0.15)_0%,rgba(58,14,109,0.9)_100%)]" />
            <p className="relative text-xl font-extrabold leading-tight">{promoHeadline}</p>
            <p className="relative mt-2 text-sm text-white/80">{promoSub}</p>
          </Link>

          {products === undefined &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-[220px] flex-[0_0_auto] animate-pulse rounded-xl bg-slate-100"
              />
            ))}

          {products &&
            products.slice(0, 8).map((product) => (
              <div key={product._id} className="w-[220px] flex-[0_0_auto]">
                <ProductCard product={product} />
              </div>
            ))}
        </Carousel>
      )}
    </section>
  );
}
