"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { formatPrice } from "@/lib/format";
import { clearAdminToken } from "@/lib/adminSession";
import StorageImage from "@/components/StorageImage";
import ProductForm from "./ProductForm";
import TestimonialsPanel from "./TestimonialsPanel";
import TrustBadgesPanel from "./TrustBadgesPanel";
import AboutPanel from "./AboutPanel";
import ContactPanel from "./ContactPanel";
import PolicyPanel from "./PolicyPanel";

// Keep in sync with MAX_PRODUCTS in convex/products.ts — that's the
// enforced limit, this is just for the UI hint.
const MAX_PRODUCTS = 20;

export default function AdminDashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<
    "products" | "testimonials" | "trustBadges" | "about" | "contact" | "policies"
  >("products");
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

  const productCount = products?.length ?? 0;
  const atProductLimit = productCount >= MAX_PRODUCTS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin</h1>
          {tab === "products" && products && (
            <p className="mt-0.5 text-xs text-slate-500">
              {productCount} / {MAX_PRODUCTS} products
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {tab === "products" && editing === null && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => setEditing("new")}
                disabled={atProductLimit}
                title={atProductLimit ? `Product limit reached (${MAX_PRODUCTS} max)` : undefined}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:opacity-100"
              >
                + Add product
              </button>
              {atProductLimit && (
                <p className="text-xs text-red-600">Limit reached — delete one to add another.</p>
              )}
            </div>
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
        <button
          onClick={() => setTab("trustBadges")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "trustBadges"
              ? "border-b-2 border-brand text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Trust Badges
        </button>
        <button
          onClick={() => setTab("about")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "about"
              ? "border-b-2 border-brand text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          About Page
        </button>
        <button
          onClick={() => setTab("contact")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "contact"
              ? "border-b-2 border-brand text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Contact Info
        </button>
        <button
          onClick={() => setTab("policies")}
          className={`px-4 py-2 text-sm font-semibold ${
            tab === "policies"
              ? "border-b-2 border-brand text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Policy Pages
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
                      <StorageImage
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
                      {product.category === "gaming" ? "Gaming" : "Pre-Owned"} ·{" "}
                      {formatPrice(product.price)}
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
      {tab === "trustBadges" && <TrustBadgesPanel token={token} />}
      {tab === "about" && <AboutPanel token={token} />}
      {tab === "contact" && <ContactPanel token={token} />}
      {tab === "policies" && <PolicyPanel token={token} />}
    </div>
  );
}
