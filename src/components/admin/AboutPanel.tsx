"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

export default function AboutPanel({ token }: { token: string }) {
  const hero = useQuery(api.about.getHero, {});
  const panels = useQuery(api.about.listPanels, {});
  const updateHero = useMutation(api.about.updateHero);
  const addPanel = useMutation(api.about.addPanel);
  const updatePanel = useMutation(api.about.updatePanel);
  const removePanel = useMutation(api.about.removePanel);
  const togglePanelHidden = useMutation(api.about.togglePanelHidden);
  const movePanel = useMutation(api.about.movePanel);

  const [heroForm, setHeroForm] = useState({ eyebrow: "", title: "", subtitle: "" });
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  useEffect(() => {
    if (hero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroForm({ eyebrow: hero.eyebrow, title: hero.title, subtitle: hero.subtitle });
    }
  }, [hero]);

  async function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHeroError(null);
    if (!heroForm.title.trim()) {
      setHeroError("Title is required.");
      return;
    }
    setHeroSaving(true);
    try {
      await updateHero({
        token,
        eyebrow: heroForm.eyebrow.trim(),
        title: heroForm.title.trim(),
        subtitle: heroForm.subtitle.trim(),
      });
    } catch (err) {
      setHeroError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setHeroSaving(false);
    }
  }

  const [editing, setEditing] = useState<Doc<"aboutPanels"> | "new" | null>(null);
  const [panelForm, setPanelForm] = useState({ title: "", body: "" });
  const [panelSaving, setPanelSaving] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startAdd() {
    setPanelForm({ title: "", body: "" });
    setEditing("new");
  }

  function startEdit(panel: Doc<"aboutPanels">) {
    setPanelForm({ title: panel.title, body: panel.body });
    setEditing(panel);
  }

  async function handlePanelSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPanelError(null);
    if (!panelForm.title.trim() || !panelForm.body.trim()) {
      setPanelError("Title and body are required.");
      return;
    }
    setPanelSaving(true);
    try {
      const args = { token, title: panelForm.title.trim(), body: panelForm.body.trim() };
      if (editing === "new") {
        await addPanel(args);
      } else if (editing) {
        await updatePanel({ ...args, id: editing._id });
      }
      setEditing(null);
    } catch (err) {
      setPanelError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setPanelSaving(false);
    }
  }

  async function handleDeletePanel(id: Id<"aboutPanels">) {
    if (!confirm("Delete this panel?")) return;
    setBusyId(id);
    try {
      await removePanel({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Page header</h2>
        <form onSubmit={handleHeroSubmit} className="space-y-4 rounded-xl border border-slate-200 p-6">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Eyebrow</span>
            <input
              value={heroForm.eyebrow}
              onChange={(e) => setHeroForm((f) => ({ ...f, eyebrow: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Title</span>
            <input
              value={heroForm.title}
              onChange={(e) => setHeroForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Subtitle</span>
            <textarea
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm((f) => ({ ...f, subtitle: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          {heroError && <p className="text-sm text-red-600">{heroError}</p>}
          <button
            type="submit"
            disabled={heroSaving}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {heroSaving ? "Saving…" : "Save header"}
          </button>
        </form>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Content panels</h2>
          {editing === null && (
            <button
              onClick={startAdd}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Add panel
            </button>
          )}
        </div>

        {editing !== null && (
          <form
            onSubmit={handlePanelSubmit}
            className="mb-6 space-y-4 rounded-xl border border-slate-200 p-6"
          >
            <h3 className="text-sm font-bold text-slate-900">
              {editing === "new" ? "Add panel" : "Edit panel"}
            </h3>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Heading</span>
              <input
                value={panelForm.title}
                onChange={(e) => setPanelForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Body</span>
              <textarea
                value={panelForm.body}
                onChange={(e) => setPanelForm((f) => ({ ...f, body: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            {panelError && <p className="text-sm text-red-600">{panelError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={panelSaving}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {panelSaving ? "Saving…" : "Save"}
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

        {panels === undefined && <p className="text-sm text-slate-500">Loading…</p>}

        {panels && panels.length > 0 && (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {panels.map((panel, i) => (
              <div key={panel._id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => movePanel({ token, id: panel._id, direction: "up" })}
                    disabled={i === 0}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => movePanel({ token, id: panel._id, direction: "down" })}
                    disabled={i === panels.length - 1}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <div className={`min-w-0 flex-1 ${panel.hidden ? "opacity-40" : ""}`}>
                  <p className="text-sm font-semibold text-slate-900">
                    {panel.title}
                    {panel.hidden && <span className="ml-2 text-xs text-slate-400">Hidden</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{panel.body}</p>
                </div>
                <button
                  onClick={() => togglePanelHidden({ token, id: panel._id })}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {panel.hidden ? "Show" : "Hide"}
                </button>
                <button
                  onClick={() => startEdit(panel)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePanel(panel._id)}
                  disabled={busyId === panel._id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                >
                  {busyId === panel._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
