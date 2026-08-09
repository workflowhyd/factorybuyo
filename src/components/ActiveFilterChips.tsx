"use client";

import { X } from "lucide-react";
import { EMPTY_FILTERS, type FilterState } from "@/lib/filterUrl";

type Chip =
  | { kind: "list"; key: "brand" | "cpu" | "gpu" | "ram" | "storage" | "display" | "conditionGrade"; label: string; value: string }
  | { kind: "inStock" }
  | { kind: "price" };

const LIST_KEYS = ["brand", "cpu", "gpu", "ram", "storage", "display", "conditionGrade"] as const;

export default function ActiveFilterChips({
  value,
  onChange,
  labels,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  labels: Record<string, string>;
}) {
  const chips: Chip[] = [];
  for (const key of LIST_KEYS) {
    for (const v of value[key]) {
      chips.push({ kind: "list", key, label: labels[key] ?? key, value: v });
    }
  }
  if (value.inStockOnly) chips.push({ kind: "inStock" });
  if (value.priceMin !== null || value.priceMax !== null) chips.push({ kind: "price" });

  if (chips.length === 0) return null;

  function remove(chip: Chip) {
    if (chip.kind === "inStock") return onChange({ ...value, inStockOnly: false });
    if (chip.kind === "price") return onChange({ ...value, priceMin: null, priceMax: null });
    return onChange({ ...value, [chip.key]: value[chip.key].filter((v) => v !== chip.value) });
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={() => remove(chip)}
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
        >
          {chip.kind === "list" && (
            <>
              {chip.label}: {chip.value}
            </>
          )}
          {chip.kind === "inStock" && "In stock only"}
          {chip.kind === "price" && (
            <>
              Price: {value.priceMin ?? "min"}–{value.priceMax ?? "max"}
            </>
          )}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button onClick={() => onChange(EMPTY_FILTERS)} className="text-xs font-semibold text-brand hover:underline">
        Clear all
      </button>
    </div>
  );
}
