"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import StorageImage from "@/components/StorageImage";
import { formatPrice } from "@/lib/format";
import { getRegionalPrice, isAvailableInRegion } from "@/lib/pricing";
import { useRegion } from "@/context/RegionContext";
import { getRecentlyViewed, type RecentlyViewedItem } from "@/lib/recentlyViewed";

export default function PredictiveSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { region } = useRegion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recent, setRecent] = useState<RecentlyViewedItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // The portaled mobile panel lives outside containerRef in the real DOM, so
  // the outside-click check below needs to know about it separately.
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // The mobile panel is portaled to <body> so it can't get trapped inside
  // the sticky header's stacking context — but document.body only exists
  // once mounted on the client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 150);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setRecent(getRecentlyViewed());
  }, [open]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      const insideContainer = containerRef.current?.contains(target);
      const insideMobilePanel = mobilePanelRef.current?.contains(target);
      if (!insideContainer && !insideMobilePanel) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const popular = useQuery(api.search.listPopular, {});
  const predictive = useQuery(api.search.predictive, debounced ? { query: debounced } : "skip");

  function submit(value?: string) {
    const q = (value ?? query).trim();
    setOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function renderPanelBody() {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:max-h-[60vh]">
        {!debounced && (
          <div className="space-y-5">
            {recent.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Recently viewed
                </p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/product/${r.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {r.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Categories</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/gaming-laptops" onClick={() => setOpen(false)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">
                  Gaming Laptops
                </Link>
                <Link href="/preowned-laptops" onClick={() => setOpen(false)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">
                  Pre-Owned Laptops
                </Link>
                <Link href="/hot-deals" onClick={() => setOpen(false)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200">
                  Hot Deals
                </Link>
              </div>
            </div>
            {popular && popular.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => submit(p.query)}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {debounced && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr]">
            <div className="space-y-4">
              {predictive && predictive.categories.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Categories
                  </p>
                  {predictive.categories.map((c) => (
                    <Link
                      key={c.value}
                      href={c.value === "gaming" ? "/gaming-laptops" : "/preowned-laptops"}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
              {predictive && predictive.brands.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Brands</p>
                  {predictive.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => submit(b)}
                      className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Search term
                </p>
                <button
                  onClick={() => submit()}
                  className="block w-full rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-brand hover:bg-slate-50"
                >
                  &quot;{debounced}&quot;
                </button>
              </div>
            </div>

            <div>
              {predictive === undefined && <p className="text-sm text-slate-400">Searching…</p>}
              {predictive && predictive.products.length === 0 && (
                <p className="text-sm text-slate-500">No laptops matched &quot;{debounced}&quot;.</p>
              )}
              {predictive && predictive.products.length > 0 && (
                <div className="space-y-1">
                  {predictive.products.map((p) => {
                    const available = isAvailableInRegion(p, region);
                    const { price } = getRegionalPrice(p, region);
                    return (
                      <Link
                        key={p._id}
                        href={`/product/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50"
                      >
                        <div className="relative h-12 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
                          {p.images[0] && (
                            <StorageImage src={p.images[0]} alt="" fill unoptimized className="object-contain" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                          <p className="truncate text-xs text-slate-500">
                            {[p.specs.cpu, p.specs.ram].filter(Boolean).join(" · ")}
                            {p.conditionGrade ? ` · ${p.conditionGrade}` : ""}
                          </p>
                        </div>
                        <p className="flex-shrink-0 text-sm font-semibold text-slate-900">
                          {available ? formatPrice(price, region) : "N/A"}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
              {predictive && predictive.products.length > 0 && (
                <button onClick={() => submit()} className="mt-3 text-sm font-semibold text-brand hover:underline">
                  View all results for &quot;{debounced}&quot; →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="What are you looking for…."
            className="w-full rounded-full bg-slate-100 py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2.5 text-white transition-all hover:scale-105 hover:bg-slate-800 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {open && (
        <>
          {/* Desktop: small dropdown anchored to the search bar above (stays
              inline — it only needs to sit near the input, not escape the
              header). */}
          <div className="absolute left-0 top-full z-40 mt-2 hidden max-h-[70vh] w-[min(640px,90vw)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.25)] sm:block">
            {renderPanelBody()}
          </div>

          {/* Mobile: full-screen panel, portaled to <body> so it can't get
              trapped inside the sticky header's stacking context — without
              this, it can render visually behind later page content instead
              of covering the whole screen. */}
          {mounted &&
            createPortal(
              <div ref={mobilePanelRef} className="fixed inset-0 z-[90] flex flex-col bg-white sm:hidden">
                <div className="flex items-center gap-2 border-b border-slate-100 p-3">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for…."
                    className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm focus:outline-none"
                  />
                  <button onClick={() => setOpen(false)} aria-label="Close search" className="p-2 text-slate-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {renderPanelBody()}
              </div>,
              document.body
            )}
        </>
      )}
    </div>
  );
}
