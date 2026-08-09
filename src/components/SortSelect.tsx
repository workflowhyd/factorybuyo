"use client";

import type { SortKey } from "@/lib/filterUrl";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "bestMatch", label: "Best Match" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (next: SortKey) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700"
      aria-label="Sort products"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
