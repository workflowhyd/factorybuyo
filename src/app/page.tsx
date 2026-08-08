import TrustBadges from "@/components/TrustBadges";
import CategoryRail from "@/components/CategoryRail";
import ProductCarousel from "@/components/ProductCarousel";
import WhyFactoryBuyo from "@/components/WhyFactoryBuyo";
import Testimonials from "@/components/Testimonials";
import HeroBanner from "@/components/HeroBanner";
import LazySection from "@/components/LazySection";

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

      <LazySection minHeight={460}>
        <ProductCarousel
          title="Certified Pre-Owned Laptops"
          href="/preowned-laptops"
          category="refurbished"
          promoHeadline="Like new, less the price."
          promoSub="40-point tested, 6-month warranty, a fraction of the cost."
          promoImage="/placeholders/dell-latitude-7400.svg"
        />
      </LazySection>

      <LazySection minHeight={480}>
        <WhyFactoryBuyo />
      </LazySection>

      <LazySection minHeight={420}>
        <Testimonials />
      </LazySection>
    </div>
  );
}
