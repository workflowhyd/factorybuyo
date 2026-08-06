import TrustBadges from "@/components/TrustBadges";
import CategoryRail from "@/components/CategoryRail";
import ProductCarousel from "@/components/ProductCarousel";
import WhyFactoryBuyo from "@/components/WhyFactoryBuyo";
import Testimonials from "@/components/Testimonials";
import HeroBanner from "@/components/HeroBanner";

export default function Home() {
  return (
    <div>
      <HeroBanner />

      <TrustBadges />

      <CategoryRail />

      <ProductCarousel
        title="Trending Gaming Laptops"
        href="/gaming-laptops"
        category="gaming"
        promoHeadline="Built to play."
        promoSub="Hand-picked gaming laptops with the specs that actually matter."
        promoImage="/placeholders/asus-rog-strix-g16.svg"
      />
      <ProductCarousel
        title="Certified Refurbished Laptops"
        href="/refurbished-laptops"
        category="refurbished"
        promoHeadline="Like new, less the price."
        promoSub="40-point tested, 6-month warranty, a fraction of the cost."
        promoImage="/placeholders/dell-latitude-7400.svg"
      />

      <WhyFactoryBuyo />

      <Testimonials />

      <TrustBadges />
    </div>
  );
}
