import { Suspense } from "react";
import CollectionPage from "@/components/CollectionPage";

export default function PreOwnedLaptopsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16">Loading…</div>}>
      <CollectionPage
        title="Certified Pre-Owned Laptops"
        description="Business-grade laptops, tested and graded (Good / Very Good / Excellent), at a fraction of the price of new."
        category="refurbished"
      />
    </Suspense>
  );
}
