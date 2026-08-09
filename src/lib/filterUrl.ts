export type FilterState = {
  brand: string[];
  cpu: string[];
  ram: string[];
  storage: string[];
  display: string[];
  conditionGrade: string[];
  inStockOnly: boolean;
  priceMin: number | null;
  priceMax: number | null;
};

export type SortKey = "bestMatch" | "priceLowHigh" | "priceHighLow" | "newest" | "oldest";

export const EMPTY_FILTERS: FilterState = {
  brand: [],
  cpu: [],
  ram: [],
  storage: [],
  display: [],
  conditionGrade: [],
  inStockOnly: false,
  priceMin: null,
  priceMax: null,
};

const LIST_KEYS = ["brand", "cpu", "ram", "storage", "display", "conditionGrade"] as const;

export function filtersFromParams(params: URLSearchParams): FilterState {
  const state = { ...EMPTY_FILTERS };
  for (const key of LIST_KEYS) {
    const raw = params.get(key);
    state[key] = raw ? raw.split(",").filter(Boolean) : [];
  }
  state.inStockOnly = params.get("inStock") === "1";
  const min = params.get("priceMin");
  const max = params.get("priceMax");
  state.priceMin = min ? Number(min) : null;
  state.priceMax = max ? Number(max) : null;
  return state;
}

export function sortFromParams(params: URLSearchParams): SortKey {
  const raw = params.get("sort");
  if (raw === "priceLowHigh" || raw === "priceHighLow" || raw === "newest" || raw === "oldest") {
    return raw;
  }
  return "bestMatch";
}

export function paramsFromState(
  filters: FilterState,
  sort: SortKey,
  extra?: Record<string, string>
): URLSearchParams {
  const params = new URLSearchParams();
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) params.set(k, v);
    }
  }
  for (const key of LIST_KEYS) {
    if (filters[key].length > 0) params.set(key, filters[key].join(","));
  }
  if (filters.inStockOnly) params.set("inStock", "1");
  if (filters.priceMin !== null) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== null) params.set("priceMax", String(filters.priceMax));
  if (sort !== "bestMatch") params.set("sort", sort);
  return params;
}

export function countActiveFilters(filters: FilterState): number {
  return (
    LIST_KEYS.reduce((sum, key) => sum + filters[key].length, 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceMin !== null || filters.priceMax !== null ? 1 : 0)
  );
}
