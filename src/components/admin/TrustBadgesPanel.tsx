"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { ICONS } from "@/components/TrustBadges";

const ICON_NAMES = Object.keys(ICONS);

type FormState = { icon: string; title: string; desc: string; href: string };
const emptyForm: FormState = { icon: ICON_NAMES[0], title: "", desc: "", href: "" };

export default function TrustBadgesPanel({ token }: { token: string }) {
  const badges = useQuery(api.trustBadges.list, {});
  const add = useMutation(api.trustBadges.add);
  const update = useMutation(api.trustBadges.update);
  const remove = useMutation(api.trustBadges.remove);
  const toggleHidden = useMutation(api.trustBadges.toggleHidden);
  const move = useMutation(api.trustBadges.move);

  const [editing, setEditing] = useState<Doc<"trustBadges"> | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startAdd() {
    setForm(emptyForm);
    setEditing("new");
  }

  function startEdit(badge: Doc<"trustBadges">) {
    setForm({ icon: badge.icon, title: badge.title, desc: badge.desc, href: badge.href ?? "" });
    setEditing(badge);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.desc.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const args = {
        token,
        icon: form.icon,
        title: form.title.trim(),
        desc: form.desc.trim(),
        href: form.href.trim() || undefined,
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

  async function handleDelete(id: Id<"trustBadges">) {
    if (!confirm("Delete this trust badge?")) return;
    setBusyId(id);
    try {
      await remove({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Trust badge strip</h2>
          {editing === null && (
            <button
              onClick={startAdd}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Add badge
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Shown above the footer on every page. Hide an item to remove it without deleting it, or
          hide all of them to remove the strip entirely.
        </p>
      </div>

      {editing !== null && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900">
            {editing === "new" ? "Add badge" : "Edit badge"}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Icon</span>
              <select
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Description</span>
            <textarea
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Link <span className="text-slate-400">(optional)</span>
            </span>
            <input
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="/gaming-laptops"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
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

      {badges === undefined && <p className="text-sm text-slate-500">Loading…</p>}

      {badges && badges.length > 0 && (
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {badges.map((badge, i) => (
            <div key={badge._id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move({ token, id: badge._id, direction: "up" })}
                  disabled={i === 0}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => move({ token, id: badge._id, direction: "down" })}
                  disabled={i === badges.length - 1}
                  className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
              <div className={`min-w-0 flex-1 ${badge.hidden ? "opacity-40" : ""}`}>
                <p className="text-sm font-semibold text-slate-900">
                  {badge.title} <span className="text-slate-400">· {badge.icon}</span>
                  {badge.hidden && <span className="ml-2 text-xs text-slate-400">Hidden</span>}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{badge.desc}</p>
              </div>
              <button
                onClick={() => toggleHidden({ token, id: badge._id })}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                {badge.hidden ? "Show" : "Hide"}
              </button>
              <button
                onClick={() => startEdit(badge)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(badge._id)}
                disabled={busyId === badge._id}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
              >
                {busyId === badge._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
