"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Code = "IN" | "SG";

const DEFAULTS: Record<Code, { label: string; flag: string; bannerText: string }> = {
  IN: {
    label: "INR",
    flag: "🇮🇳",
    bannerText: "Reserve your laptop online, pay & collect at pickup — no card details needed.",
  },
  SG: {
    label: "SGD",
    flag: "🇸🇬",
    bannerText: "Reserve your laptop online, pay & collect at pickup — no card details needed.",
  },
};

function RegionForm({ token, code }: { token: string; code: Code }) {
  const all = useQuery(api.regions.list, {});
  const update = useMutation(api.regions.update);
  const existing = all?.find((r) => r.code === code);

  const [form, setForm] = useState({
    label: DEFAULTS[code].label,
    flag: DEFAULTS[code].flag,
    whatsappNumber: "",
    bannerText: DEFAULTS[code].bannerText,
    deliveryNote: "",
    marketNotice: "",
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        label: existing.label,
        flag: existing.flag,
        whatsappNumber: existing.whatsappNumber ?? "",
        bannerText: existing.bannerText,
        deliveryNote: existing.deliveryNote ?? "",
        marketNotice: existing.marketNotice ?? "",
        enabled: existing.enabled,
      });
    }
  }, [existing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!form.label.trim() || !form.flag.trim() || !form.bannerText.trim()) {
      setError("Label, flag and banner text are required.");
      return;
    }
    setSaving(true);
    try {
      await update({
        token,
        code,
        label: form.label.trim(),
        flag: form.flag.trim(),
        whatsappNumber: form.whatsappNumber.trim() || undefined,
        bannerText: form.bannerText.trim(),
        deliveryNote: form.deliveryNote.trim() || undefined,
        marketNotice: form.marketNotice.trim() || undefined,
        enabled: form.enabled,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          {code === "IN" ? "India" : "Singapore"} <span className="text-slate-400">({code})</span>
        </h3>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
          />
          Enabled
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Flag</span>
          <input
            value={form.flag}
            onChange={(e) => setForm((f) => ({ ...f, flag: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-700">Currency label</span>
          <input
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          WhatsApp number <span className="text-slate-400">(optional — falls back to the default number if blank)</span>
        </span>
        <input
          value={form.whatsappNumber}
          onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
          placeholder="e.g. 6591234567"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Top announcement banner text</span>
        <input
          value={form.bannerText}
          onChange={(e) => setForm((f) => ({ ...f, bannerText: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          Delivery note <span className="text-slate-400">(shown on the Contact page)</span>
        </span>
        <input
          value={form.deliveryNote}
          onChange={(e) => setForm((f) => ({ ...f, deliveryNote: e.target.value }))}
          placeholder="e.g. 2-4 business days across Singapore"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          Market notice <span className="text-slate-400">(optional)</span>
        </span>
        <input
          value={form.marketNotice}
          onChange={(e) => setForm((f) => ({ ...f, marketNotice: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}

export default function RegionsPanel({ token }: { token: string }) {
  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Product prices for each region are still set per-product (in the Products tab) — this
        controls everything else about how each market is presented: WhatsApp number, banner
        copy, delivery messaging, and whether the region is offered at all.
      </p>
      <RegionForm token={token} code="IN" />
      <RegionForm token={token} code="SG" />
    </div>
  );
}
