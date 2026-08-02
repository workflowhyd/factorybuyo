import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";
import CategoryRail from "@/components/CategoryRail";
import ProductCarousel from "@/components/ProductCarousel";
import WhyFactoryBuyo from "@/components/WhyFactoryBuyo";

export default function Home() {
  return (
    <div>
      <section className="bg-[linear-gradient(135deg,#3a0e6d_0%,#7d1f83_50%,#e6127d_100%)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 sm:py-24 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
              Handpicked for India
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-5xl">
              Trending gaming laptops.
              <br />
              Certified refurbished deals.
            </h1>
            <p className="mt-4 max-w-md text-white/80">
              A small, hand-checked lineup of the gaming laptops everyone&apos;s searching for,
              plus certified refurbished laptops at a fraction of the price. Reserve online — pay
              and pick up after confirming on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/gaming-laptops"
                className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 hover:opacity-90"
              >
                Shop Gaming Laptops
              </Link>
              <Link
                href="/refurbished-laptops"
                className="rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Shop Refurbished Laptops
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-[4/3] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm" />
          </div>
        </div>
      </section>

      <TrustBadges />

      <CategoryRail />

      <ProductCarousel
        title="Trending Gaming Laptops"
        href="/gaming-laptops"
        category="gaming"
        promoHeadline="Built to play."
        promoSub="Hand-picked gaming laptops with the specs that actually matter."
      />
      <ProductCarousel
        title="Certified Refurbished Laptops"
        href="/refurbished-laptops"
        category="refurbished"
        promoHeadline="Like new, less the price."
        promoSub="40-point tested, 6-month warranty, a fraction of the cost."
      />

      <WhyFactoryBuyo />

      <TrustBadges />
    </div>
  );
}
