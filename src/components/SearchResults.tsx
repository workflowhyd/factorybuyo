"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import ActiveFilterChips from "@/components/ActiveFilterChips";
import SortSelect from "@/components/SortSelect";
import { FilterSidebar, FilterDrawer, type Facets, type FilterDef } from "@/components/ProductFilters";
import {
  EMPTY_FILTERS,
  filtersFromParams,
  sortFromParams,
  paramsFromState,
  type FilterState,
  type SortKey,
} from "@/lib/filterUrl";
import type { Doc } from "../../convex/_generated/dataModel";

const CATEGORY_TAGS = [
  { label: "Gaming Laptops", href: "/gaming-laptops" },
  { label: "Pre-Owned Laptops", href: "/preowned-laptops" },
  { label: "Hot Deals", href: "/hot-deals" },
];

// Search spans both categories, so unlike a single category page it always
// offers the full filter set rather than an admin-curated per-category one.
const SEARCH_FILTER_DEFS: FilterDef[] = [
  { key: "brand", label: "Brand" },
  { key: "price", label: "Price" },
  { key: "cpu", label: "Processor" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "conditionGrade", label: "Condition" },
  { key: "inStock", label: "Available now" },
];
const LABELS = Object.fromEntries(SEARCH_FILTER_DEFS.map((d) => [d.key, d.label]));

function computeFacets(products: Doc<"products">[]): Facets {
  const set = (values: (string | undefined)[]) =>
    Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();
  const prices = products.map((p) => p.price);
  return {
    brands: set(products.map((p) => p.brand)),
    cpus: set(products.map((p) => p.specs.cpu)),
    gpus: set(products.map((p) => p.specs.gpu)),
    rams: set(products.map((p) => p.specs.ram)),
    storages: set(products.map((p) => p.specs.storage)),
    displays: set(products.map((p) => p.specs.display)),
    conditions: set(products.map((p) => p.conditionGrade)),
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 0,
  };
}

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);
  const sort = useMemo(() => sortFromParams(searchParams), [searchParams]);

  function updateUrl(nextFilters: FilterState, nextSort: SortKey) {
    const params = paramsFromState(nextFilters, nextSort, { q });
    router.push(`?${params.toString()}`, { scroll: false });
  }

  const matched = useQuery(api.search.fullSearch, q ? { query: q } : "skip");
  const matchedIds = matched?.map((p) => p._id);

  const results = useQuery(
    api.filters.listFiltered,
    matchedIds
      ? {
          productIds: matchedIds,
          brand: filters.brand.length ? filters.brand : undefined,
          cpu: filters.cpu.length ? filters.cpu : undefined,
          ram: filters.ram.length ? filters.ram : undefined,
          storage: filters.storage.length ? filters.storage : undefined,
          conditionGrade: filters.conditionGrade.length ? filters.conditionGrade : undefined,
          inStockOnly: filters.inStockOnly || undefined,
          priceMin: filters.priceMin ?? undefined,
          priceMax: filters.priceMax ?? undefined,
          sort,
        }
      : "skip"
  );

  const facets = matched ? computeFacets(matched) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORY_TAGS.map((tag) => (
          <Link
            key={tag.label}
            href={tag.href}
            className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            {tag.label}
          </Link>
        ))}
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
      </div>

      {!q && <p className="text-sm text-slate-500">Type something in the search bar above.</p>}

      {q && (
        <div className="flex gap-8">
          {facets && (
            <FilterSidebar
              defs={SEARCH_FILTER_DEFS}
              facets={facets}
              value={filters}
              onChange={(f) => updateUrl(f, sort)}
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {results === undefined
                  ? "Loading…"
                  : `${results.length} result${results.length === 1 ? "" : "s"}`}
              </p>
              <div className="flex items-center gap-2">
                {facets && (
                  <FilterDrawer
                    defs={SEARCH_FILTER_DEFS}
                    facets={facets}
                    value={filters}
                    onChange={(f) => updateUrl(f, sort)}
                  />
                )}
                <SortSelect value={sort} onChange={(s) => updateUrl(filters, s)} />
              </div>
            </div>

            <ActiveFilterChips value={filters} onChange={(f) => updateUrl(f, sort)} labels={LABELS} />

            {(matched === undefined || (matchedIds && results === undefined)) && (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            )}

            {results && results.length === 0 && (
              <p className="rounded-2xl bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                No laptops matched &quot;{q}&quot;
                {(filters.brand.length ||
                  filters.cpu.length ||
                  filters.ram.length ||
                  filters.storage.length ||
                  filters.conditionGrade.length ||
                  filters.inStockOnly ||
                  filters.priceMin !== null ||
                  filters.priceMax !== null) && (
                  <>
                    {" "}
                    with these filters —{" "}
                    <button
                      onClick={() => updateUrl(EMPTY_FILTERS, sort)}
                      className="font-semibold text-brand hover:underline"
                    >
                      clear filters
                    </button>
                  </>
                )}
                . Try a different brand or model name.
              </p>
            )}

            {results && results.length > 0 && (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {results.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
