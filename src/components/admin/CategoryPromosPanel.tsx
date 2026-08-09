"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import StorageImage from "@/components/StorageImage";

type Category = "gaming" | "refurbished";

function toDateInput(ms?: number) {
  if (!ms) return "";
  return new Date(ms).toISOString().slice(0, 10);
}
function fromDateInput(value: string): number | undefined {
  return value ? new Date(value).getTime() : undefined;
}

export default function CategoryPromosPanel({ token }: { token: string }) {
  const [category, setCategory] = useState<Category>("gaming");
  const promos = useQuery(api.promos.listAll, { category });
  const add = useMutation(api.promos.add);
  const update = useMutation(api.promos.update);
  const remove = useMutation(api.promos.remove);
  const toggleEnabled = useMutation(api.promos.toggleEnabled);
  const move = useMutation(api.promos.move);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [editing, setEditing] = useState<Doc<"categoryPromos"> | "new" | null>(null);
  const [form, setForm] = useState({
    image: "",
    headline: "",
    sub: "",
    ctaText: "",
    ctaHref: "",
    startsAt: "",
    endsAt: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startAdd() {
    setForm({ image: "", headline: "", sub: "", ctaText: "", ctaHref: "", startsAt: "", endsAt: "" });
    setEditing("new");
  }
  function startEdit(promo: Doc<"categoryPromos">) {
    setForm({
      image: promo.image,
      headline: promo.headline,
      sub: promo.sub ?? "",
      ctaText: promo.ctaText ?? "",
      ctaHref: promo.ctaHref ?? "",
      startsAt: toDateInput(promo.startsAt),
      endsAt: toDateInput(promo.endsAt),
    });
    setEditing(promo);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl({ token });
      const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setForm((f) => ({ ...f, image: `storage:${storageId}` }));
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.image.trim() || !form.headline.trim()) {
      setError("Image and headline are required.");
      return;
    }
    setSaving(true);
    try {
      const args = {
        token,
        image: form.image.trim(),
        headline: form.headline.trim(),
        sub: form.sub.trim() || undefined,
        ctaText: form.ctaText.trim() || undefined,
        ctaHref: form.ctaHref.trim() || undefined,
        startsAt: fromDateInput(form.startsAt),
        endsAt: fromDateInput(form.endsAt),
      };
      if (editing === "new") {
        await add({ ...args, category });
      } else if (editing) {
        await update({ ...args, id: editing._id });
      }
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"categoryPromos">) {
    if (!confirm("Delete this promo?")) return;
    setBusyId(id);
    try {
      await remove({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <p className="mb-4 text-xs text-slate-500">
        Promo banners at the top of each category page. One active promo shows as a large banner;
        two or more show as a row of cards. Schedule a start/end date to run a promotion
        automatically, or leave both blank to run indefinitely.
      </p>

      <div className="mb-5 flex gap-2 border-b border-slate-200">
        {(["gaming", "refurbished"] as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setEditing(null);
            }}
            className={`px-3 py-2 text-sm font-semibold ${
              category === c ? "border-b-2 border-brand text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {c === "gaming" ? "Gaming Laptops" : "Pre-Owned Laptops"}
          </button>
        ))}
      </div>

      {editing === null && (
        <button onClick={startAdd} className="mb-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + Add promo
        </button>
      )}

      {editing !== null && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900">{editing === "new" ? "Add promo" : "Edit promo"}</h3>

          <div>
            <span className="mb-1 block text-sm font-medium text-slate-700">Image</span>
            <div className="flex items-center gap-3">
              {form.image && (
                <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
                  <StorageImage src={form.image} alt="" fill unoptimized className="object-cover" />
                </div>
              )}
              <label className="cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50">
                {uploading ? "Uploading…" : form.image ? "Replace image" : "Upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Headline</span>
              <input value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Subtext (optional)</span>
              <input value={form.sub} onChange={(e) => setForm((f) => ({ ...f, sub: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">CTA text (optional)</span>
              <input value={form.ctaText} onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Link (optional)</span>
              <input value={form.ctaHref} onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))} placeholder="/gaming-laptops" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Starts (optional)</span>
              <input type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Ends (optional)</span>
              <input type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving || uploading} className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700">
              Cancel
            </button>
          </div>
        </form>
      )}

      {promos === undefined && <p className="text-sm text-slate-500">Loading…</p>}
      {promos && promos.length === 0 && <p className="text-sm text-slate-500">No promos for this category yet.</p>}

      {promos && promos.length > 0 && (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {promos.map((promo, i) => (
            <div key={promo._id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => move({ token, id: promo._id, direction: "up" })} disabled={i === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">▲</button>
                <button onClick={() => move({ token, id: promo._id, direction: "down" })} disabled={i === promos.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30">▼</button>
              </div>
              <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100">
                <StorageImage src={promo.image} alt="" fill unoptimized className="object-cover" />
              </div>
              <div className={`min-w-0 flex-1 ${!promo.enabled ? "opacity-40" : ""}`}>
                <p className="text-sm font-semibold text-slate-900">
                  {promo.headline}
                  {!promo.enabled && <span className="ml-2 text-xs text-slate-400">Disabled</span>}
                </p>
                {(promo.startsAt || promo.endsAt) && (
                  <p className="text-xs text-slate-500">
                    {promo.startsAt ? new Date(promo.startsAt).toLocaleDateString() : "Always"} –{" "}
                    {promo.endsAt ? new Date(promo.endsAt).toLocaleDateString() : "No end"}
                  </p>
                )}
              </div>
              <button onClick={() => toggleEnabled({ token, id: promo._id })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {promo.enabled ? "Disable" : "Enable"}
              </button>
              <button onClick={() => startEdit(promo)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                Edit
              </button>
              <button onClick={() => handleDelete(promo._id)} disabled={busyId === promo._id} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50">
                {busyId === promo._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
