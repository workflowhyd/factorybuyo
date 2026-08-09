"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

export default function FaqPanel({ token }: { token: string }) {
  const faqs = useQuery(api.faq.list, {});
  const settings = useQuery(api.faq.getSettings, {});
  const updateSettings = useMutation(api.faq.updateSettings);
  const add = useMutation(api.faq.add);
  const update = useMutation(api.faq.update);
  const remove = useMutation(api.faq.remove);
  const toggleHidden = useMutation(api.faq.toggleHidden);
  const move = useMutation(api.faq.move);

  const [settingsForm, setSettingsForm] = useState({
    heading: "",
    intro: "",
    defaultOpenId: "",
    ctaEnabled: true,
    ctaText: "",
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettingsForm({
        heading: settings.heading,
        intro: settings.intro ?? "",
        defaultOpenId: settings.defaultOpenId ?? "",
        ctaEnabled: settings.ctaEnabled,
        ctaText: settings.ctaText,
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
        defaultOpenId: (settingsForm.defaultOpenId || undefined) as Id<"faqs"> | undefined,
        ctaEnabled: settingsForm.ctaEnabled,
        ctaText: settingsForm.ctaText.trim(),
      });
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSettingsSaving(false);
    }
  }

  const [editing, setEditing] = useState<Doc<"faqs"> | "new" | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startAdd() {
    setForm({ question: "", answer: "" });
    setEditing("new");
  }

  function startEdit(faq: Doc<"faqs">) {
    setForm({ question: faq.question, answer: faq.answer });
    setEditing(faq);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Question and answer are required.");
      return;
    }
    setSaving(true);
    try {
      const args = { token, question: form.question.trim(), answer: form.answer.trim() };
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

  async function handleDelete(id: Id<"faqs">) {
    if (!confirm("Delete this question?")) return;
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
        <h2 className="mb-4 text-lg font-bold text-slate-900">FAQ section settings</h2>
        <form
          onSubmit={handleSettingsSubmit}
          className="space-y-4 rounded-xl border border-slate-200 p-6"
        >
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
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Default open question</span>
            <select
              value={settingsForm.defaultOpenId}
              onChange={(e) => setSettingsForm((f) => ({ ...f, defaultOpenId: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 sm:max-w-sm"
            >
              <option value="">First question (default)</option>
              {faqs?.map((faq) => (
                <option key={faq._id} value={faq._id}>
                  {faq.question}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settingsForm.ctaEnabled}
              onChange={(e) => setSettingsForm((f) => ({ ...f, ctaEnabled: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="font-medium text-slate-700">Show WhatsApp call-to-action below the FAQ</span>
          </label>
          {settingsForm.ctaEnabled && (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Call-to-action text</span>
              <input
                value={settingsForm.ctaText}
                onChange={(e) => setSettingsForm((f) => ({ ...f, ctaText: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          )}

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
          <h2 className="text-lg font-bold text-slate-900">Questions</h2>
          {editing === null && (
            <button
              onClick={startAdd}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Add question
            </button>
          )}
        </div>

        {editing !== null && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900">
              {editing === "new" ? "Add question" : "Edit question"}
            </h3>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Question</span>
              <input
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Answer</span>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={4}
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

        {faqs === undefined && <p className="text-sm text-slate-500">Loading…</p>}

        {faqs && faqs.length > 0 && (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {faqs.map((faq, i) => (
              <div key={faq._id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => move({ token, id: faq._id, direction: "up" })}
                    disabled={i === 0}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => move({ token, id: faq._id, direction: "down" })}
                    disabled={i === faqs.length - 1}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <div className={`min-w-0 flex-1 ${faq.hidden ? "opacity-40" : ""}`}>
                  <p className="text-sm font-semibold text-slate-900">
                    {faq.question}
                    {faq.hidden && <span className="ml-2 text-xs text-slate-400">Hidden</span>}
                    {settings?.defaultOpenId === faq._id && (
                      <span className="ml-2 text-xs text-brand">Default open</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{faq.answer}</p>
                </div>
                <button
                  onClick={() => toggleHidden({ token, id: faq._id })}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {faq.hidden ? "Show" : "Hide"}
                </button>
                <button
                  onClick={() => startEdit(faq)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  disabled={busyId === faq._id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                >
                  {busyId === faq._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
