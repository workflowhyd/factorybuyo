"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import StorageImage from "@/components/StorageImage";

type FormState = {
  name: string;
  logo: string;
  mode: "auto" | "manual";
  matchBrand: string;
  matchCategory: "" | "gaming" | "refurbished";
  sortBy: "newest" | "featured" | "default";
  onlyInStock: boolean;
  visibleCount: string;
  productIds: Id<"products">[];
};

function toFormState(brand?: Doc<"brands">): FormState {
  return {
    name: brand?.name ?? "",
    logo: brand?.logo ?? "",
    mode: brand?.mode ?? "auto",
    matchBrand: brand?.matchBrand ?? "",
    matchCategory: brand?.matchCategory ?? "",
    sortBy: brand?.sortBy ?? "default",
    onlyInStock: brand?.onlyInStock ?? true,
    visibleCount: brand ? String(brand.visibleCount) : "8",
    productIds: brand?.productIds ?? [],
  };
}

export default function BrandsPanel({ token }: { token: string }) {
  const brands = useQuery(api.brands.list, {});
  const settings = useQuery(api.brands.getSettings, {});
  const products = useQuery(api.products.list, {});
  const updateSettings = useMutation(api.brands.updateSettings);
  const add = useMutation(api.brands.add);
  const update = useMutation(api.brands.update);
  const remove = useMutation(api.brands.remove);
  const toggleHidden = useMutation(api.brands.toggleHidden);
  const move = useMutation(api.brands.move);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [settingsForm, setSettingsForm] = useState({ heading: "", intro: "", ctaLabel: "", ctaHref: "" });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettingsForm({
        heading: settings.heading,
        intro: settings.intro ?? "",
        ctaLabel: settings.ctaLabel,
        ctaHref: settings.ctaHref,
      });
    }
  }, [settings]);

  async function handleSettingsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSettingsError(null);
    if (!settingsForm.heading.trim()) {
      setSettingsError("Heading is required.");
      return;
    }
    setSettingsSaving(true);
    try {
      await updateSettings({
        token,
        heading: settingsForm.heading.trim(),
        intro: settingsForm.intro.trim() || undefined,
        ctaLabel: settingsForm.ctaLabel.trim(),
        ctaHref: settingsForm.ctaHref.trim(),
      });
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSettingsSaving(false);
    }
  }

  const [editing, setEditing] = useState<Doc<"brands"> | "new" | null>(null);
  const [form, setForm] = useState<FormState>(() => toFormState());
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startAdd() {
    setForm(toFormState());
    setEditing("new");
  }
  function startEdit(brand: Doc<"brands">) {
    setForm(toFormState(brand));
    setEditing(brand);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl({ token });
      const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setForm((f) => ({ ...f, logo: `storage:${storageId}` }));
    } catch {
      setError("Logo upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function toggleProduct(id: Id<"products">) {
    setForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((p) => p !== id)
        : [...f.productIds, id],
    }));
  }
  function moveProduct(id: Id<"products">, direction: "up" | "down") {
    setForm((f) => {
      const ids = [...f.productIds];
      const i = ids.indexOf(id);
      const j = direction === "up" ? i - 1 : i + 1;
      if (i === -1 || j < 0 || j >= ids.length) return f;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      return { ...f, productIds: ids };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.logo.trim()) {
      setError("Name and logo are required.");
      return;
    }
    if (form.mode === "manual" && form.productIds.length === 0) {
      setError("Pick at least one product for manual mode.");
      return;
    }
    setSaving(true);
    try {
      const args = {
        token,
        name: form.name.trim(),
        logo: form.logo.trim(),
        mode: form.mode,
        matchBrand: form.matchBrand.trim() || undefined,
        matchCategory: form.matchCategory || undefined,
        sortBy: form.sortBy,
        onlyInStock: form.onlyInStock,
        visibleCount: Math.max(1, Number(form.visibleCount) || 8),
        productIds: form.productIds,
      };
      if (editing === "new") {
        await add(args);
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

  async function handleDelete(id: Id<"brands">) {
    if (!confirm("Delete this brand?")) return;
    setBusyId(id);
    try {
      await remove({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Brand switcher settings</h2>
        <form onSubmit={handleSettingsSubmit} className="space-y-4 rounded-xl border border-slate-200 p-6">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Heading</span>
            <input
              value={settingsForm.heading}
              onChange={(e) => setSettingsForm((f) => ({ ...f, heading: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Intro <span className="text-slate-400">(optional)</span>
            </span>
            <input
              value={settingsForm.intro}
              onChange={(e) => setSettingsForm((f) => ({ ...f, intro: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">CTA label</span>
              <input
                value={settingsForm.ctaLabel}
                onChange={(e) => setSettingsForm((f) => ({ ...f, ctaLabel: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">CTA link</span>
              <input
                value={settingsForm.ctaHref}
                onChange={(e) => setSettingsForm((f) => ({ ...f, ctaHref: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          {settingsError && <p className="text-sm text-red-600">{settingsError}</p>}
          <button
            type="submit"
            disabled={settingsSaving}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {settingsSaving ? "Saving…" : "Save settings"}
          </button>
        </form>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Brands</h2>
          {editing === null && (
            <button
              onClick={startAdd}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Add brand
            </button>
          )}
        </div>

        {editing !== null && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900">
              {editing === "new" ? "Add brand" : "Edit brand"}
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <div className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">Logo</span>
                <div className="flex items-center gap-3">
                  {form.logo && (
                    <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <StorageImage src={form.logo} alt="" fill unoptimized className="object-contain" />
                    </div>
                  )}
                  <label className="cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50">
                    {uploading ? "Uploading…" : form.logo ? "Replace logo" : "Upload logo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.mode === "auto"}
                  onChange={() => setForm((f) => ({ ...f, mode: "auto" }))}
                />
                Automatic (match by brand)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.mode === "manual"}
                  onChange={() => setForm((f) => ({ ...f, mode: "manual" }))}
                />
                Manual (pick products)
              </label>
            </div>

            {form.mode === "auto" ? (
              <div className="grid grid-cols-1 gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">
                    Match product brand <span className="text-slate-400">(defaults to name)</span>
                  </span>
                  <input
                    value={form.matchBrand}
                    onChange={(e) => setForm((f) => ({ ...f, matchBrand: e.target.value }))}
                    placeholder={form.name || "e.g. Dell"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">
                    Category <span className="text-slate-400">(optional)</span>
                  </span>
                  <select
                    value={form.matchCategory}
                    onChange={(e) => setForm((f) => ({ ...f, matchCategory: e.target.value as FormState["matchCategory"] }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Any category</option>
                    <option value="gaming">Gaming</option>
                    <option value="refurbished">Pre-Owned</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Sort by</span>
                  <select
                    value={form.sortBy}
                    onChange={(e) => setForm((f) => ({ ...f, sortBy: e.target.value as FormState["sortBy"] }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="default">Default</option>
                    <option value="newest">Newest inventory</option>
                    <option value="featured">Featured first</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Max cards to show</span>
                  <input
                    type="number"
                    min={1}
                    value={form.visibleCount}
                    onChange={(e) => setForm((f) => ({ ...f, visibleCount: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.onlyInStock}
                    onChange={(e) => setForm((f) => ({ ...f, onlyInStock: e.target.checked }))}
                  />
                  Only show products currently in stock
                </label>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Pick which products appear, then use the arrows to set their order.
                </p>
                <div className="max-h-56 space-y-1.5 overflow-y-auto">
                  {products?.map((p) => (
                    <label key={p._id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(p._id)}
                        onChange={() => toggleProduct(p._id)}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
                {form.productIds.length > 0 && (
                  <div className="space-y-1 border-t border-slate-200 pt-3">
                    {form.productIds.map((id, i) => {
                      const p = products?.find((pr) => pr._id === id);
                      return (
                        <div key={id} className="flex items-center gap-2 text-xs text-slate-600">
                          <button type="button" onClick={() => moveProduct(id, "up")} disabled={i === 0} className="disabled:opacity-30">▲</button>
                          <button type="button" onClick={() => moveProduct(id, "down")} disabled={i === form.productIds.length - 1} className="disabled:opacity-30">▼</button>
                          <span>{p?.name ?? "(deleted product)"}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {brands === undefined && <p className="text-sm text-slate-500">Loading…</p>}

        {brands && brands.length > 0 && (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {brands.map((brand, i) => (
              <div key={brand._id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => move({ token, id: brand._id, direction: "up" })} disabled={i === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30" aria-label="Move up">▲</button>
                  <button onClick={() => move({ token, id: brand._id, direction: "down" })} disabled={i === brands.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30" aria-label="Move down">▼</button>
                </div>
                <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-white">
                  <StorageImage src={brand.logo} alt="" fill unoptimized className="object-contain" />
                </div>
                <div className={`min-w-0 flex-1 ${brand.hidden ? "opacity-40" : ""}`}>
                  <p className="text-sm font-semibold text-slate-900">
                    {brand.name}
                    {brand.hidden && <span className="ml-2 text-xs text-slate-400">Hidden</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {brand.mode === "manual" ? `Manual · ${brand.productIds.length} products` : `Auto · matches "${brand.matchBrand ?? brand.name}"`}
                  </p>
                </div>
                <button onClick={() => toggleHidden({ token, id: brand._id })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {brand.hidden ? "Show" : "Hide"}
                </button>
                <button onClick={() => startEdit(brand)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  disabled={busyId === brand._id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                >
                  {busyId === brand._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
