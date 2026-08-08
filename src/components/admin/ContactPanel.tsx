"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ContactPanel({ token }: { token: string }) {
  const info = useQuery(api.contact.get, {});
  const update = useMutation(api.contact.update);

  const [form, setForm] = useState({
    email: "",
    marketsNote: "",
    phone: "",
    hours: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (info) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        email: info.email,
        marketsNote: info.marketsNote,
        phone: info.phone ?? "",
        hours: info.hours ?? "",
        address: info.address ?? "",
      });
    }
  }, [info]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }
    setSaving(true);
    try {
      await update({
        token,
        email: form.email.trim(),
        marketsNote: form.marketsNote.trim(),
        phone: form.phone.trim() || undefined,
        hours: form.hours.trim() || undefined,
        address: form.address.trim() || undefined,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-slate-900">Contact information</h2>
      <p className="mb-4 text-xs text-slate-500">
        Shown on the public /contact page. Leave phone, hours or address blank to hide that card.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 p-6">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Email</span>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Phone <span className="text-slate-400">(optional)</span>
            </span>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Operating hours <span className="text-slate-400">(optional)</span>
            </span>
            <input
              value={form.hours}
              onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
              placeholder="Mon–Sat, 10am–7pm"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Address <span className="text-slate-400">(optional)</span>
          </span>
          <input
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Markets note</span>
          <textarea
            value={form.marketsNote}
            onChange={(e) => setForm((f) => ({ ...f, marketsNote: e.target.value }))}
            rows={2}
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
    </div>
  );
}
