"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Category = "gaming" | "refurbished";
type FilterKey = "brand" | "price" | "cpu" | "gpu" | "ram" | "storage" | "display" | "conditionGrade" | "inStock";

const ALL_KEYS: { key: FilterKey; label: string }[] = [
  { key: "brand", label: "Brand" },
  { key: "price", label: "Price" },
  { key: "cpu", label: "Processor" },
  { key: "gpu", label: "Graphics" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "display", label: "Display" },
  { key: "conditionGrade", label: "Condition" },
  { key: "inStock", label: "Available now" },
];

export default function FilterDefsPanel({ token }: { token: string }) {
  const [category, setCategory] = useState<Category>("gaming");
  const defs = useQuery(api.filters.listDefs, { category });
  const addDef = useMutation(api.filters.addDef);
  const updateDef = useMutation(api.filters.updateDef);
  const removeDef = useMutation(api.filters.removeDef);
  const toggleEnabled = useMutation(api.filters.toggleDefEnabled);
  const move = useMutation(api.filters.moveDef);

  const [addKey, setAddKey] = useState<FilterKey>("brand");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [labelDraft, setLabelDraft] = useState("");

  const usedKeys = new Set((defs ?? []).map((d) => d.key));
  const availableKeys = ALL_KEYS.filter((k) => !usedKeys.has(k.key));

  async function handleAdd() {
    setError(null);
    const preset = ALL_KEYS.find((k) => k.key === addKey);
    try {
      await addDef({ token, category, key: addKey, label: preset?.label ?? addKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add filter.");
    }
  }

  return (
    <div>
      <p className="mb-4 text-xs text-slate-500">
        Choose which filters appear in the sidebar on each category page, their order, and their
        labels. Available values (e.g. which brands show up) come from your actual product data —
        add products with a spec and the filter picks it up automatically.
      </p>

      <div className="mb-5 flex gap-2 border-b border-slate-200">
        {(["gaming", "refurbished"] as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-2 text-sm font-semibold ${
              category === c ? "border-b-2 border-brand text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {c === "gaming" ? "Gaming Laptops" : "Pre-Owned Laptops"}
          </button>
        ))}
      </div>

      {availableKeys.length > 0 && (
        <div className="mb-5 flex items-end gap-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Add a filter</span>
            <select
              value={addKey}
              onChange={(e) => setAddKey(e.target.value as FilterKey)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              {availableKeys.map((k) => (
                <option key={k.key} value={k.key}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleAdd} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            + Add
          </button>
        </div>
      )}
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {defs === undefined && <p className="text-sm text-slate-500">Loading…</p>}
      {defs && defs.length === 0 && <p className="text-sm text-slate-500">No filters added for this category yet.</p>}

      {defs && defs.length > 0 && (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {defs.map((def, i) => (
            <div key={def._id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => move({ token, id: def._id, direction: "up" })} disabled={i === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                <button onClick={() => move({ token, id: def._id, direction: "down" })} disabled={i === defs.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
              </div>
              <div className={`min-w-0 flex-1 ${!def.enabled ? "opacity-40" : ""}`}>
                {editingId === def._id ? (
                  <div className="flex gap-2">
                    <input
                      value={labelDraft}
                      onChange={(e) => setLabelDraft(e.target.value)}
                      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                    />
                    <button
                      onClick={async () => {
                        await updateDef({ token, id: def._id, label: labelDraft.trim() || def.label });
                        setEditingId(null);
                      }}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-900">
                    {def.label} <span className="text-slate-400">({def.key})</span>
                    {!def.enabled && <span className="ml-2 text-xs text-slate-400">Hidden</span>}
                  </p>
                )}
              </div>
              {editingId !== def._id && (
                <button
                  onClick={() => {
                    setEditingId(def._id);
                    setLabelDraft(def.label);
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Rename
                </button>
              )}
              <button onClick={() => toggleEnabled({ token, id: def._id })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {def.enabled ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => removeDef({ token, id: def._id })}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
