"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function SearchSettingsPanel({ token }: { token: string }) {
  const settings = useQuery(api.search.getSettings, {});
  const updateSettings = useMutation(api.search.updateSettings);
  const synonyms = useQuery(api.search.listSynonyms, {});
  const addSynonym = useMutation(api.search.addSynonym);
  const removeSynonym = useMutation(api.search.removeSynonym);
  const popular = useQuery(api.search.listPopular, {});
  const addPopular = useMutation(api.search.addPopular);
  const removePopular = useMutation(api.search.removePopular);

  const [displayLimit, setDisplayLimit] = useState("6");
  const [limitSaved, setLimitSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayLimit(String(settings.displayLimit));
    }
  }, [settings]);

  const [term, setTerm] = useState("");
  const [synonym, setSynonym] = useState("");
  const [synError, setSynError] = useState<string | null>(null);

  const [popLabel, setPopLabel] = useState("");
  const [popQuery, setPopQuery] = useState("");
  const [popError, setPopError] = useState<string | null>(null);

  async function handleLimitSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLimitSaved(false);
    await updateSettings({ token, displayLimit: Math.max(1, Number(displayLimit) || 6) });
    setLimitSaved(true);
  }

  async function handleAddSynonym(e: React.FormEvent) {
    e.preventDefault();
    setSynError(null);
    if (!term.trim() || !synonym.trim()) {
      setSynError("Both a term and its synonym are required.");
      return;
    }
    await addSynonym({ token, term: term.trim(), synonym: synonym.trim() });
    setTerm("");
    setSynonym("");
  }

  async function handleAddPopular(e: React.FormEvent) {
    e.preventDefault();
    setPopError(null);
    if (!popLabel.trim() || !popQuery.trim()) {
      setPopError("Both a label and a search query are required.");
      return;
    }
    await addPopular({ token, label: popLabel.trim(), query: popQuery.trim() });
    setPopLabel("");
    setPopQuery("");
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-1 text-lg font-bold text-slate-900">Predictive search</h2>
        <p className="mb-4 text-xs text-slate-500">
          How many matching products show in the live search panel while typing.
        </p>
        <form onSubmit={handleLimitSubmit} className="flex items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Results shown</span>
            <input
              type="number"
              min={1}
              value={displayLimit}
              onChange={(e) => setDisplayLimit(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Save
          </button>
          {limitSaved && <span className="text-sm text-green-600">Saved.</span>}
        </form>
      </div>

      <div>
        <h2 className="mb-1 text-lg font-bold text-slate-900">Popular searches</h2>
        <p className="mb-4 text-xs text-slate-500">
          Shown as quick shortcuts before the customer starts typing.
        </p>
        <form onSubmit={handleAddPopular} className="mb-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Label</span>
            <input value={popLabel} onChange={(e) => setPopLabel(e.target.value)} placeholder="Gaming under ₹80,000" className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Search query</span>
            <input value={popQuery} onChange={(e) => setPopQuery(e.target.value)} placeholder="RTX 4060" className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            + Add
          </button>
        </form>
        {popError && <p className="mb-3 text-sm text-red-600">{popError}</p>}
        <div className="flex flex-wrap gap-2">
          {popular?.map((p) => (
            <span key={p._id} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              {p.label}
              <button onClick={() => removePopular({ token, id: p._id })} className="text-slate-400 hover:text-red-600">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-1 text-lg font-bold text-slate-900">Synonyms</h2>
        <p className="mb-4 text-xs text-slate-500">
          Terms treated as equivalent — e.g. &quot;notebook&quot; ↔ &quot;laptop&quot;, &quot;ssd&quot; ↔ &quot;storage&quot;. Works in both directions.
        </p>
        <form onSubmit={handleAddSynonym} className="mb-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Term</span>
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="notebook" className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <span className="pb-2 text-slate-400">↔</span>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-700">Synonym</span>
            <input value={synonym} onChange={(e) => setSynonym(e.target.value)} placeholder="laptop" className="rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            + Add
          </button>
        </form>
        {synError && <p className="mb-3 text-sm text-red-600">{synError}</p>}
        <div className="flex flex-wrap gap-2">
          {synonyms?.map((s) => (
            <span key={s._id} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              {s.term} ↔ {s.synonym}
              <button onClick={() => removeSynonym({ token, id: s._id })} className="text-slate-400 hover:text-red-600">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
