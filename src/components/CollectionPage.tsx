"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import CategoryPromoBanner from "@/components/CategoryPromoBanner";
import { FilterSidebar, FilterDrawer } from "@/components/ProductFilters";
import ActiveFilterChips from "@/components/ActiveFilterChips";
import SortSelect from "@/components/SortSelect";
import {
  EMPTY_FILTERS,
  filtersFromParams,
  sortFromParams,
  paramsFromState,
  type FilterState,
  type SortKey,
} from "@/lib/filterUrl";

const CATEGORY_TAGS: { label: string; href: string; value: "gaming" | "refurbished" | null }[] = [
  { label: "Gaming Laptops", href: "/gaming-laptops", value: "gaming" },
  { label: "Pre-Owned Laptops", href: "/preowned-laptops", value: "refurbished" },
  { label: "Hot Deals", href: "/hot-deals", value: null },
];

export default function CollectionPage({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: "gaming" | "refurbished";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const sort = useMemo(() => sortFromParams(searchParams), [searchParams]);

  function updateUrl(nextFilters: FilterState, nextSort: SortKey) {
    const params = paramsFromState(nextFilters, nextSort);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  }

  const defs = useQuery(api.filters.listDefs, { category });
  const facets = useQuery(api.filters.getFacets, { category });
  const products = useQuery(api.filters.listFiltered, {
    category,
    brand: filters.brand.length ? filters.brand : undefined,
    cpu: filters.cpu.length ? filters.cpu : undefined,
    gpu: filters.gpu.length ? filters.gpu : undefined,
    ram: filters.ram.length ? filters.ram : undefined,
    storage: filters.storage.length ? filters.storage : undefined,
    display: filters.display.length ? filters.display : undefined,
    conditionGrade: filters.conditionGrade.length ? filters.conditionGrade : undefined,
    inStockOnly: filters.inStockOnly || undefined,
    priceMin: filters.priceMin ?? undefined,
    priceMax: filters.priceMax ?? undefined,
    sort,
  });

  const enabledDefs = (defs ?? []).filter((d) => d.enabled);
  const labels = Object.fromEntries((defs ?? []).map((d) => [d.key, d.label]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <CategoryPromoBanner category={category} />

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-500 sm:mt-2.5 sm:text-sm">
          {description}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORY_TAGS.map((tag) => (
          <Link
            key={tag.label}
            href={tag.href}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tag.value === category
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tag.label}
          </Link>
        ))}
      </div>

      <div className="flex gap-8">
        {facets && enabledDefs.length > 0 && (
          <FilterSidebar
            defs={enabledDefs}
            facets={facets}
            value={filters}
            onChange={(f) => updateUrl(f, sort)}
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {products === undefined
                ? "Loading…"
                : `${products.length} laptop${products.length === 1 ? "" : "s"}`}
            </p>
            <div className="flex items-center gap-2">
              {facets && enabledDefs.length > 0 && (
                <FilterDrawer
                  defs={enabledDefs}
                  facets={facets}
                  value={filters}
                  onChange={(f) => updateUrl(f, sort)}
                />
              )}
              <SortSelect value={sort} onChange={(s) => updateUrl(filters, s)} />
            </div>
          </div>

          <ActiveFilterChips value={filters} onChange={(f) => updateUrl(f, sort)} labels={labels} />

          {products === undefined && (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          )}

          {products && products.length === 0 && (
            <p className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              No laptops match these filters.{" "}
              <button
                onClick={() => updateUrl(EMPTY_FILTERS, sort)}
                className="font-semibold text-brand hover:underline"
              >
                Clear filters
              </button>{" "}
              or check back soon — new stock arrives often.
            </p>
          )}

          {products && products.length > 0 && (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
