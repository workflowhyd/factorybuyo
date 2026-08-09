"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const SECTIONS: { key: keyof State; label: string }[] = [
  { key: "showHighlights", label: "Product Highlights" },
  { key: "showSpecs", label: "Full Specifications" },
  { key: "showCondition", label: "Refurbished Condition" },
  { key: "showIncluded", label: "What's Included" },
  { key: "showWarranty", label: "Warranty and Returns" },
  { key: "showReviews", label: "Customer Reviews" },
  { key: "showQA", label: "Product Questions and Answers" },
  { key: "showCompare", label: "Compare Similar Products" },
];

type State = {
  showHighlights: boolean;
  showSpecs: boolean;
  showCondition: boolean;
  showIncluded: boolean;
  showWarranty: boolean;
  showReviews: boolean;
  showQA: boolean;
  showCompare: boolean;
};

const DEFAULTS: State = {
  showHighlights: true,
  showSpecs: true,
  showCondition: true,
  showIncluded: true,
  showWarranty: true,
  showReviews: true,
  showQA: true,
  showCompare: true,
};

export default function ProductDetailSettingsPanel({ token }: { token: string }) {
  const settings = useQuery(api.productDetailSettings.get, {});
  const update = useMutation(api.productDetailSettings.update);

  const [form, setForm] = useState<State>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        showHighlights: settings.showHighlights,
        showSpecs: settings.showSpecs,
        showCondition: settings.showCondition,
        showIncluded: settings.showIncluded,
        showWarranty: settings.showWarranty,
        showReviews: settings.showReviews,
        showQA: settings.showQA,
        showCompare: settings.showCompare,
      });
    }
  }, [settings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await update({ token, ...form });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-slate-900">Product page sections</h2>
      <p className="mb-4 text-xs text-slate-500">
        Turn sections on or off across every product page. Content still comes from each product
        (Products tab) and from customer Q&amp;A / reviews below — this only controls visibility.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 p-6">
        {SECTIONS.map((s) => (
          <label key={s.key} className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={form[s.key]}
              onChange={(e) => setForm((f) => ({ ...f, [s.key]: e.target.checked }))}
            />
            {s.label}
          </label>
        ))}
        {saved && <p className="text-sm text-green-600">Saved.</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
