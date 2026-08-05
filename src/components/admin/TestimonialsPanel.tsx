"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

// Keep in sync with MAX_TESTIMONIALS in convex/testimonials.ts — that's
// the enforced limit, this is just for the UI hint.
const MAX_TESTIMONIALS = 10;

export default function TestimonialsPanel({ token }: { token: string }) {
  const testimonials = useQuery(api.testimonials.list, {});
  const addTestimonial = useMutation(api.testimonials.add);
  const removeTestimonial = useMutation(api.testimonials.remove);
  const testimonialCount = testimonials?.length ?? 0;
  const atTestimonialLimit = testimonialCount >= MAX_TESTIMONIALS;

  const [name, setName] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (atTestimonialLimit) {
      setError(`Testimonial limit reached (${MAX_TESTIMONIALS} max).`);
      return;
    }
    if (!name.trim() || !quote.trim()) {
      setError("Name and quote are required.");
      return;
    }
    setSaving(true);
    try {
      await addTestimonial({ token, name: name.trim(), quote: quote.trim(), rating });
      setName("");
      setQuote("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"testimonials">) {
    if (!confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    try {
      await removeTestimonial({ token, id });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add a customer testimonial</h2>
          {testimonials && (
            <span className="text-xs text-slate-500">
              {testimonialCount} / {MAX_TESTIMONIALS}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Only add real feedback you&apos;ve actually received from a customer — this shows up
          publicly on the homepage.
        </p>
        {atTestimonialLimit && (
          <p className="text-xs font-semibold text-red-600">
            Limit reached ({MAX_TESTIMONIALS} max) — delete one below to add another.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Customer name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Quote</span>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving || atTestimonialLimit}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add testimonial"}
        </button>
      </form>

      {testimonials === undefined && <p className="text-sm text-slate-500">Loading…</p>}

      {testimonials && testimonials.length === 0 && (
        <p className="text-sm text-slate-500">
          No testimonials yet — the homepage section stays hidden until you add one.
        </p>
      )}

      {testimonials && testimonials.length > 0 && (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {testimonials.map((t) => (
            <div key={t._id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {t.name} · {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.quote}</p>
              </div>
              <button
                onClick={() => handleDelete(t._id)}
                disabled={deletingId === t._id}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
              >
                {deletingId === t._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
