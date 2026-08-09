import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

export default function GamingLaptopsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16">Loading…</div>}>
      <CollectionPage
        title="Trending Gaming Laptops"
        description="A tight, hand-picked lineup of the gaming laptops trending in the Indian market right now — not a huge catalogue, just the ones worth buying."
        category="gaming"
      />
    </Suspense>
  );
}
