"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectToProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  useEffect(() => {
    router.replace(slug ? `/product/${slug}` : "/search");
  }, [router, slug]);

  return <p className="mx-auto max-w-6xl px-4 py-16 text-slate-500">Redirecting…</p>;
}

export default function ProductRedirectPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16">Loading…</div>}>
      <RedirectToProduct />
    </Suspense>
  );
}
