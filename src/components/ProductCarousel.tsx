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
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Reveal className="mb-5 flex items-end justify-between sm:mb-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-[28px]">
          {title}
        </h2>
        <Link
          href={href}
          className="group flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-900 transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white sm:px-4 sm:py-2"
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
            className="group relative flex w-[190px] flex-[0_0_auto] flex-col justify-end overflow-hidden rounded-2xl p-4 text-white shadow-[0_20px_40px_-16px_rgba(58,14,109,0.4)] transition-all duration-400 ease-out hover:-translate-y-1.5 sm:w-[270px] sm:p-6"
          >
            <Image
              src={promoImage}
              alt=""
              fill
              unoptimized
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,14,109,0.1)_0%,rgba(58,14,109,0.92)_100%)]" />
            <p className="relative text-base font-bold leading-tight tracking-tight sm:text-xl">
              {promoHeadline}
            </p>
            <p className="relative mt-1.5 text-xs text-white/80 sm:mt-2 sm:text-sm">{promoSub}</p>
          </Link>

          {products === undefined &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-[170px] flex-[0_0_auto] animate-pulse rounded-2xl bg-slate-100 sm:w-[220px]"
              />
            ))}

          {products &&
            products.slice(0, 8).map((product) => (
              <div key={product._id} className="w-[170px] flex-[0_0_auto] sm:w-[220px]">
                <ProductCard product={product} />
              </div>
            ))}
        </Carousel>
      )}
    </section>
  );
}
