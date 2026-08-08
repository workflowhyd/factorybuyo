"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

type Slug = "privacy-policy" | "terms-and-conditions" | "cancellation-policy";

const PAGES: { slug: Slug; label: string }[] = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms and Conditions" },
  { slug: "cancellation-policy", label: "Cancellation Policy" },
];

export default function PolicyPanel({ token }: { token: string }) {
  const [slug, setSlug] = useState<Slug>("privacy-policy");
  const data = useQuery(api.policy.getPage, { slug });
  const updateMeta = useMutation(api.policy.updatePageMeta);
  const addSection = useMutation(api.policy.addSection);
  const updateSection = useMutation(api.policy.updateSection);
  const removeSection = useMutation(api.policy.removeSection);
  const moveSection = useMutation(api.policy.moveSection);

  const [metaForm, setMetaForm] = useState({ title: "", intro: "", lastUpdated: "" });
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.page) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMetaForm({
        title: data.page.title,
        intro: data.page.intro ?? "",
        lastUpdated: data.page.lastUpdated,
      });
    } else if (data && !data.page) {
      const fallback = PAGES.find((p) => p.slug === slug)?.label ?? "";
      setMetaForm({ title: fallback, intro: "", lastUpdated: "" });
    }
  }, [data, slug]);

  async function handleMetaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMetaError(null);
    if (!metaForm.title.trim() || !metaForm.lastUpdated.trim()) {
      setMetaError("Title and last-updated date are required.");
      return;
    }
    setMetaSaving(true);
    try {
      await updateMeta({
        token,
        slug,
        title: metaForm.title.trim(),
        intro: metaForm.intro.trim() || undefined,
        lastUpdated: metaForm.lastUpdated.trim(),
      });
    } catch (err) {
      setMetaError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setMetaSaving(false);
    }
  }

  const [editing, setEditing] = useState<Doc<"policySections"> | "new" | null>(null);
  const [sectionForm, setSectionForm] = useState({ heading: "", body: "" });
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startAdd() {
    setSectionForm({ heading: "", body: "" });
    setEditing("new");
  }

  function startEdit(section: Doc<"policySections">) {
    setSectionForm({ heading: section.heading, body: section.body });
    setEditing(section);
  }

  async function handleSectionSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSectionError(null);
    if (!sectionForm.heading.trim() || !sectionForm.body.trim()) {
      setSectionError("Heading and body are required.");
      return;
    }
    setSectionSaving(true);
    try {
      if (editing === "new") {
        await addSection({
          token,
          pageSlug: slug,
          heading: sectionForm.heading.trim(),
          body: sectionForm.body.trim(),
        });
      } else if (editing) {
        await updateSection({
          token,
          id: editing._id,
          heading: sectionForm.heading.trim(),
          body: sectionForm.body.trim(),
        });
      }
      setEditing(null);
    } catch (err) {
      setSectionError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSectionSaving(false);
    }
  }

  async function handleDeleteSection(id: Id<"policySections">) {
    if (!confirm("Delete this section?")) return;
    setBusyId(id);
    try {
      await removeSection({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  const sections = data?.sections ?? [];

  return (
    <div className="space-y-8">
      <div className="flex gap-2 border-b border-slate-200">
        {PAGES.map((p) => (
          <button
            key={p.slug}
            onClick={() => {
              setSlug(p.slug);
              setEditing(null);
            }}
            className={`px-3 py-2 text-sm font-semibold ${
              slug === p.slug
                ? "border-b-2 border-brand text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold text-slate-900">Page header</h3>
        <form
          onSubmit={handleMetaSubmit}
          className="space-y-4 rounded-xl border border-slate-200 p-6"
        >
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Title</span>
            <input
              value={metaForm.title}
              onChange={(e) => setMetaForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">
              Intro <span className="text-slate-400">(optional)</span>
            </span>
            <input
              value={metaForm.intro}
              onChange={(e) => setMetaForm((f) => ({ ...f, intro: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Last updated</span>
            <input
              value={metaForm.lastUpdated}
              onChange={(e) => setMetaForm((f) => ({ ...f, lastUpdated: e.target.value }))}
              placeholder="August 2026"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 sm:max-w-xs"
            />
          </label>
          {metaError && <p className="text-sm text-red-600">{metaError}</p>}
          <button
            type="submit"
            disabled={metaSaving}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {metaSaving ? "Saving…" : "Save header"}
          </button>
        </form>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Sections</h3>
          {editing === null && (
            <button
              onClick={startAdd}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Add section
            </button>
          )}
        </div>

        {editing !== null && (
          <form
            onSubmit={handleSectionSubmit}
            className="mb-6 space-y-4 rounded-xl border border-slate-200 p-6"
          >
            <h4 className="text-sm font-bold text-slate-900">
              {editing === "new" ? "Add section" : "Edit section"}
            </h4>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Heading</span>
              <input
                value={sectionForm.heading}
                onChange={(e) => setSectionForm((f) => ({ ...f, heading: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Body</span>
              <textarea
                value={sectionForm.body}
                onChange={(e) => setSectionForm((f) => ({ ...f, body: e.target.value }))}
                rows={6}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <span className="mt-1 block text-xs text-slate-400">
                Blank line = new paragraph. Lines starting with &quot;- &quot; become a bullet list.
              </span>
            </label>
            {sectionError && <p className="text-sm text-red-600">{sectionError}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={sectionSaving}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {sectionSaving ? "Saving…" : "Save"}
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

        {data === undefined && <p className="text-sm text-slate-500">Loading…</p>}

        {sections.length > 0 && (
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {sections.map((section, i) => (
              <div key={section._id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() =>
                      moveSection({ token, id: section._id, pageSlug: slug, direction: "up" })
                    }
                    disabled={i === 0}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() =>
                      moveSection({ token, id: section._id, pageSlug: slug, direction: "down" })
                    }
                    disabled={i === sections.length - 1}
                    className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{section.heading}</p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{section.body}</p>
                </div>
                <button
                  onClick={() => startEdit(section)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSection(section._id)}
                  disabled={busyId === section._id}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                >
                  {busyId === section._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
