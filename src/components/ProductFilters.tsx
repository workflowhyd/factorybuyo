"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { EMPTY_FILTERS, type FilterState } from "@/lib/filterUrl";

export type FilterDefKey =
  | "brand"
  | "price"
  | "cpu"
  | "gpu"
  | "ram"
  | "storage"
  | "display"
  | "conditionGrade"
  | "inStock";

export type FilterDef = { key: FilterDefKey; label: string };

export type Facets = {
  brands: string[];
  cpus: string[];
  gpus: string[];
  rams: string[];
  storages: string[];
  displays: string[];
  conditions: string[];
  priceMin: number;
  priceMax: number;
};

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) =>
                onChange(e.target.checked ? [...selected, opt] : selected.filter((o) => o !== opt))
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function PriceRange({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: { min: number | null; max: number | null };
  onChange: (next: { min: number | null; max: number | null }) => void;
}) {
  if (min >= max) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value.min ?? ""}
          placeholder={String(min)}
          onChange={(e) => onChange({ ...value, min: e.target.value ? Number(e.target.value) : null })}
          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
        />
        <span className="text-slate-400">–</span>
        <input
          type="number"
          value={value.max ?? ""}
          placeholder={String(max)}
          onChange={(e) => onChange({ ...value, max: e.target.value ? Number(e.target.value) : null })}
          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
        />
      </div>
    </div>
  );
}

export function FilterControls({
  defs,
  facets,
  value,
  onChange,
}: {
  defs: FilterDef[];
  facets: Facets;
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="space-y-6">
      {defs.map((def) => {
        switch (def.key) {
          case "brand":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.brands}
                selected={value.brand}
                onChange={(v) => onChange({ ...value, brand: v })}
              />
            );
          case "cpu":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.cpus}
                selected={value.cpu}
                onChange={(v) => onChange({ ...value, cpu: v })}
              />
            );
          case "gpu":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.gpus}
                selected={value.gpu}
                onChange={(v) => onChange({ ...value, gpu: v })}
              />
            );
          case "ram":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.rams}
                selected={value.ram}
                onChange={(v) => onChange({ ...value, ram: v })}
              />
            );
          case "storage":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.storages}
                selected={value.storage}
                onChange={(v) => onChange({ ...value, storage: v })}
              />
            );
          case "display":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.displays}
                selected={value.display}
                onChange={(v) => onChange({ ...value, display: v })}
              />
            );
          case "conditionGrade":
            return (
              <CheckboxGroup
                key={def.key}
                label={def.label}
                options={facets.conditions}
                selected={value.conditionGrade}
                onChange={(v) => onChange({ ...value, conditionGrade: v })}
              />
            );
          case "inStock":
            return (
              <label key={def.key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={value.inStockOnly}
                  onChange={(e) => onChange({ ...value, inStockOnly: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300"
                />
                {def.label}
              </label>
            );
          case "price":
            return (
              <PriceRange
                key={def.key}
                min={facets.priceMin}
                max={facets.priceMax}
                value={{ min: value.priceMin, max: value.priceMax }}
                onChange={({ min, max }) => onChange({ ...value, priceMin: min, priceMax: max })}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export function FilterSidebar(props: {
  defs: FilterDef[];
  facets: Facets;
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const active = countActive(props.value);
  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">Filters</p>
        {active > 0 && (
          <button
            onClick={() => props.onChange(EMPTY_FILTERS)}
            className="text-xs font-semibold text-brand hover:underline"
          >
            Reset
          </button>
        )}
      </div>
      <div className="mt-4">
        <FilterControls {...props} />
      </div>
    </aside>
  );
}

export function FilterDrawer(props: {
  defs: FilterDef[];
  facets: Facets;
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<FilterState>(props.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setDraft(props.value);
  }, [open, props.value]);

  const active = countActive(props.value);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-900"
      >
        Filters
        {active > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
            {active}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <p className="text-sm font-bold text-slate-900">Filters</p>
            <button onClick={() => setOpen(false)} aria-label="Close filters" className="p-1 text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <FilterControls defs={props.defs} facets={props.facets} value={draft} onChange={setDraft} />
          </div>
          <div className="flex gap-3 border-t border-slate-100 p-4">
            <button
              onClick={() => setDraft(EMPTY_FILTERS)}
              className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
            >
              Reset
            </button>
            <button
              onClick={() => {
                props.onChange(draft);
                setOpen(false);
              }}
              className="flex-1 rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function countActive(f: FilterState) {
  return (
    f.brand.length +
    f.cpu.length +
    f.ram.length +
    f.storage.length +
    f.display.length +
    f.conditionGrade.length +
    (f.inStockOnly ? 1 : 0) +
    (f.priceMin !== null || f.priceMax !== null ? 1 : 0)
  );
}
