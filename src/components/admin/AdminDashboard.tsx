"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { formatINR } from "@/lib/format";
import { clearAdminToken } from "@/lib/adminSession";
import ProductForm from "./ProductForm";
import TestimonialsPanel from "./TestimonialsPanel";

export default function AdminDashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<"products" | "testimonials">("products");
  const products = useQuery(api.products.list, {});
  const removeProduct = useMutation(api.products.remove);
  const [editing, setEditing] = useState<Doc<"products"> | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(product: Doc<"products">) {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    setDeletingId(product._id);
    try {
      await removeProduct({ token, id: product._id });
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    clearAdminToken();
    onLogout();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-900">Admin</h1>
        <div className="flex gap-3">
          {tab === "products" && editing === null && (
            <button
              onClick={() => setEditing("new")}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Add product
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "products"
              ? "border-b-2 border-brand text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("testimonials")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "testimonials"
              ? "border-b-2 border-brand text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Testimonials
        </button>
      </div>

      {tab === "products" && (
        <>
          {editing !== null && (
            <div className="mb-8">
              <ProductForm
                token={token}
                product={editing === "new" ? undefined : editing}
                onDone={() => setEditing(null)}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}

          {products === undefined && <p className="text-sm text-slate-500">Loading products…</p>}

          {products && products.length === 0 && (
            <p className="text-sm text-slate-500">No products yet — add your first one above.</p>
          )}

          {products && products.length > 0 && (
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {product.category === "gaming" ? "Gaming" : "Refurbished"} ·{" "}
                      {formatINR(product.price)}
                      {!product.inStock && " · Sold out"}
                      {product.featured && " · Featured"}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing(product)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product._id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    {deletingId === product._id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "testimonials" && <TestimonialsPanel token={token} />}
    </div>
  );
}
