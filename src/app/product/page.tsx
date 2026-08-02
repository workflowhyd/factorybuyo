import { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16">Loading…</div>}>
      <ProductDetail />
    </Suspense>
  );
}
