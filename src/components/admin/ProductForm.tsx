"use client";

import { useState } from "react";
import StorageImage from "@/components/StorageImage";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { slugify } from "@/lib/slugify";

type FormState = {
  slug: string;
  name: string;
  category: "gaming" | "refurbished";
  brand: string;
  price: string;
  originalPrice: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: string;
  conditionGrade: "" | "Good" | "Very Good" | "Excellent";
  images: string[];
  featured: boolean;
  inStock: boolean;
};

function toFormState(product?: Doc<"products">): FormState {
  return {
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    category: product?.category ?? "gaming",
    brand: product?.brand ?? "",
    price: product ? String(product.price) : "",
    originalPrice: product?.originalPrice ? String(product.originalPrice) : "",
    cpu: product?.specs.cpu ?? "",
    gpu: product?.specs.gpu ?? "",
    ram: product?.specs.ram ?? "",
    storage: product?.specs.storage ?? "",
    display: product?.specs.display ?? "",
    conditionGrade: product?.conditionGrade ?? "",
    images: product?.images ?? [],
    featured: product?.featured ?? false,
    inStock: product?.inStock ?? true,
  };
}

export default function ProductForm({
  token,
  product,
  onDone,
  onCancel,
}: {
  token: string;
  product?: Doc<"products">;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(product));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = useMutation(api.products.add);
  const updateProduct = useMutation(api.products.update);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const uploadUrl = await generateUploadUrl({ token });
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Upload failed");
        const { storageId } = await res.json();
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, `storage:${storageId}`],
        }));
      }
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.brand.trim() || !form.price) {
      setError("Name, brand, and price are required.");
      return;
    }
    if (form.images.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        token,
        slug: form.slug || slugify(form.name),
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        specs: {
          cpu: form.cpu || undefined,
          gpu: form.gpu || undefined,
          ram: form.ram || undefined,
          storage: form.storage || undefined,
          display: form.display || undefined,
        },
        conditionGrade:
          form.category === "refurbished" && form.conditionGrade
            ? form.conditionGrade
            : undefined,
        images: form.images,
        featured: form.featured,
        inStock: form.inStock,
      };

      if (product) {
        await updateProduct({ ...payload, id: product._id });
      } else {
        await addProduct(payload);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900">
        {product ? "Edit product" : "Add product"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Name</span>
          <input
            value={form.name}
            onChange={(e) => {
              update("name", e.target.value);
              if (!slugTouched) update("slug", slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Slug (URL)</span>
          <input
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Category</span>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value as FormState["category"])}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="gaming">Gaming Laptop</option>
            <option value="refurbished">Refurbished Laptop</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Brand</span>
          <input
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Price (₹)</span>
          <input
            type="number"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Original / MRP price (₹, optional)
          </span>
          <input
            type="number"
            value={form.originalPrice}
            onChange={(e) => update("originalPrice", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {form.category === "refurbished" && (
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Condition grade</span>
            <select
              value={form.conditionGrade}
              onChange={(e) =>
                update("conditionGrade", e.target.value as FormState["conditionGrade"])
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">Select grade</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">CPU</span>
          <input
            value={form.cpu}
            onChange={(e) => update("cpu", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">GPU</span>
          <input
            value={form.gpu}
            onChange={(e) => update("gpu", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">RAM</span>
          <input
            value={form.ram}
            onChange={(e) => update("ram", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Storage</span>
          <input
            value={form.storage}
            onChange={(e) => update("storage", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Display</span>
          <input
            value={form.display}
            onChange={(e) => update("display", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <span className="mb-2 block text-sm font-medium text-slate-700">Photos</span>
        <div className="flex flex-wrap gap-3">
          {form.images.map((img, i) => (
            <div key={img + i} className="relative h-20 w-24 overflow-hidden rounded-lg border">
              <StorageImage src={img} alt="" fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-500 hover:bg-slate-50">
            {uploading ? "Uploading…" : "+ Add photo"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-6 border-t border-slate-100 pt-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => update("inStock", e.target.checked)}
          />
          In stock
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : product ? "Save changes" : "Add product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
