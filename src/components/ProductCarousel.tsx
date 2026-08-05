"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import Reveal from "@/components/motion/Reveal";

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
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
      <Reveal className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          {title}
        </h2>
        <Link
          href={href}
          className="group flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-900 transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white"
        >
          See all
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      {products && products.length === 0 ? (
        <p className="text-sm text-slate-500">New stock arriving soon — check back shortly.</p>
      ) : (
        <Carousel>
          <Link
            href={href}
            className="group relative flex w-[270px] flex-[0_0_auto] flex-col justify-end overflow-hidden rounded-2xl p-6 text-white shadow-[0_20px_40px_-16px_rgba(58,14,109,0.4)] transition-all duration-400 ease-out hover:-translate-y-1.5"
          >
            <Image
              src={promoImage}
              alt=""
              fill
              unoptimized
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,14,109,0.1)_0%,rgba(58,14,109,0.92)_100%)]" />
            <p className="relative text-xl font-bold leading-tight tracking-tight">
              {promoHeadline}
            </p>
            <p className="relative mt-2 text-sm text-white/80">{promoSub}</p>
          </Link>

          {products === undefined &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-[220px] flex-[0_0_auto] animate-pulse rounded-2xl bg-slate-100"
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
