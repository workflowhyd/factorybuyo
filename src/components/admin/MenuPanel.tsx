"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

const ICON_OPTIONS = [
  "Gamepad2",
  "Recycle",
  "Flame",
  "Info",
  "FileText",
  "RotateCcw",
  "ShieldCheck",
  "Mail",
  "HelpCircle",
];

type MenuCategory = Doc<"menuItems"> & { subitems: Doc<"menuSubitems">[] };

function SubitemsEditor({ token, category }: { token: string; category: MenuCategory }) {
  const addSubitem = useMutation(api.menu.addSubitem);
  const updateSubitem = useMutation(api.menu.updateSubitem);
  const removeSubitem = useMutation(api.menu.removeSubitem);
  const moveSubitem = useMutation(api.menu.moveSubitem);

  const [editing, setEditing] = useState<Doc<"menuSubitems"> | "new" | null>(null);
  const [form, setForm] = useState({ label: "", href: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startAdd() {
    setForm({ label: "", href: "" });
    setEditing("new");
  }
  function startEdit(sub: Doc<"menuSubitems">) {
    setForm({ label: sub.label, href: sub.href });
    setEditing(sub);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.label.trim() || !form.href.trim()) {
      setError("Label and link are required.");
      return;
    }
    setSaving(true);
    try {
      if (editing === "new") {
        await addSubitem({ token, parentId: category._id, label: form.label.trim(), href: form.href.trim() });
      } else if (editing) {
        await updateSubitem({ token, id: editing._id, label: form.label.trim(), href: form.href.trim() });
      }
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ml-9 mt-2 space-y-2 rounded-lg bg-slate-50 p-3">
      {category.subitems.map((sub, i) => (
        <div key={sub._id} className="flex items-center gap-2 text-xs">
          <button onClick={() => moveSubitem({ token, id: sub._id, parentId: category._id, direction: "up" })} disabled={i === 0} className="text-slate-400 disabled:opacity-30">▲</button>
          <button onClick={() => moveSubitem({ token, id: sub._id, parentId: category._id, direction: "down" })} disabled={i === category.subitems.length - 1} className="text-slate-400 disabled:opacity-30">▼</button>
          <span className="flex-1 truncate text-slate-700">{sub.label} <span className="text-slate-400">— {sub.href}</span></span>
          <button onClick={() => startEdit(sub)} className="rounded border border-slate-300 px-2 py-1 font-semibold text-slate-600">Edit</button>
          <button
            onClick={() => {
              if (confirm("Delete this subcategory link?")) removeSubitem({ token, id: sub._id });
            }}
            className="rounded border border-red-200 px-2 py-1 font-semibold text-red-600"
          >
            Delete
          </button>
        </div>
      ))}

      {editing !== null ? (
        <form onSubmit={handleSubmit} className="space-y-2 border-t border-slate-200 pt-2">
          <input
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="Label"
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
          />
          <input
            value={form.href}
            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
            placeholder="/link"
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={startAdd} className="text-xs font-semibold text-brand hover:underline">
          + Add subcategory link
        </button>
      )}
    </div>
  );
}

function ItemList({
  token,
  kind,
  items,
}: {
  token: string;
  kind: "category" | "info";
  items: MenuCategory[] | Doc<"menuItems">[];
}) {
  const addItem = useMutation(api.menu.addItem);
  const updateItem = useMutation(api.menu.updateItem);
  const removeItem = useMutation(api.menu.removeItem);
  const toggleItemHidden = useMutation(api.menu.toggleItemHidden);
  const moveItem = useMutation(api.menu.moveItem);

  const [editing, setEditing] = useState<Doc<"menuItems"> | "new" | null>(null);
  const [form, setForm] = useState({ label: "", href: "", icon: ICON_OPTIONS[0] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function startAdd() {
    setForm({ label: "", href: "", icon: ICON_OPTIONS[0] });
    setEditing("new");
  }
  function startEdit(item: Doc<"menuItems">) {
    setForm({ label: item.label, href: item.href, icon: item.icon ?? ICON_OPTIONS[0] });
    setEditing(item);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.label.trim() || !form.href.trim()) {
      setError("Label and link are required.");
      return;
    }
    setSaving(true);
    try {
      const args = { token, label: form.label.trim(), href: form.href.trim(), icon: form.icon };
      if (editing === "new") {
        await addItem({ ...args, kind });
      } else if (editing) {
        await updateItem({ ...args, id: editing._id });
      }
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"menuItems">) {
    if (!confirm(kind === "category" ? "Delete this category and its subcategories?" : "Delete this link?")) return;
    setBusyId(id);
    try {
      await removeItem({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  const visibleCount = items.filter((i) => !i.hidden).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {kind === "category" ? "Shop categories (primary panel)" : "Support links (secondary panel)"}
          </h3>
          {kind === "category" && (
            <p className="text-xs text-slate-500">
              {visibleCount} visible — keep it to 4 or fewer to match the mega menu design.
            </p>
          )}
        </div>
        {editing === null && (
          <button onClick={startAdd} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
            + Add
          </button>
        )}
      </div>

      {editing !== null && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-3 rounded-xl border border-slate-200 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Label"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="/link"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {ICON_OPTIONS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
        {items.map((item, i) => (
          <div key={item._id}>
            <div className="flex items-center gap-3 p-3.5">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem({ token, id: item._id, direction: "up" })} disabled={i === 0} className="text-slate-400 hover:text-slate-700 disabled:opacity-30" aria-label="Move up">▲</button>
                <button onClick={() => moveItem({ token, id: item._id, direction: "down" })} disabled={i === items.length - 1} className="text-slate-400 hover:text-slate-700 disabled:opacity-30" aria-label="Move down">▼</button>
              </div>
              <div className={`min-w-0 flex-1 ${item.hidden ? "opacity-40" : ""}`}>
                <p className="text-sm font-semibold text-slate-900">
                  {item.label}
                  {item.hidden && <span className="ml-2 text-xs text-slate-400">Hidden</span>}
                </p>
                <p className="text-xs text-slate-500">{item.href} · {item.icon}</p>
              </div>
              {kind === "category" && (
                <button
                  onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {expandedId === item._id ? "Hide subcategories" : `Subcategories (${(item as MenuCategory).subitems.length})`}
                </button>
              )}
              <button onClick={() => toggleItemHidden({ token, id: item._id })} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                {item.hidden ? "Show" : "Hide"}
              </button>
              <button onClick={() => startEdit(item)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={busyId === item._id}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
              >
                {busyId === item._id ? "Deleting…" : "Delete"}
              </button>
            </div>
            {kind === "category" && expandedId === item._id && (
              <div className="pb-3">
                <SubitemsEditor token={token} category={item as MenuCategory} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenuPanel({ token }: { token: string }) {
  const menu = useQuery(api.menu.getMenu, {});

  if (menu === undefined) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-10">
      <p className="text-xs text-slate-500">
        Controls the desktop &quot;Shop&quot; mega menu and the mobile slide-out menu — both read
        from the same categories and support links.
      </p>
      <ItemList token={token} kind="category" items={menu.categories} />
      <ItemList token={token} kind="info" items={menu.info} />
    </div>
  );
}
