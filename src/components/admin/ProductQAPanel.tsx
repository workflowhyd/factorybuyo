"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function ProductQAPanel({ token }: { token: string }) {
  const questions = useQuery(api.productQuestions.listAll, {});
  const products = useQuery(api.products.list, {});
  const answer = useMutation(api.productQuestions.answer);
  const setStatus = useMutation(api.productQuestions.setStatus);
  const remove = useMutation(api.productQuestions.remove);

  const [answering, setAnswering] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function productName(id: Id<"products">) {
    return products?.find((p) => p._id === id)?.name ?? "(deleted product)";
  }

  async function handleAnswer(id: Id<"productQuestions">) {
    if (!answerText.trim()) {
      setError("Write an answer before publishing.");
      return;
    }
    setError(null);
    setBusyId(id);
    try {
      await answer({ token, id, answer: answerText.trim() });
      setAnswering(null);
      setAnswerText("");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: Id<"productQuestions">) {
    if (!confirm("Delete this question?")) return;
    setBusyId(id);
    try {
      await remove({ token, id });
    } finally {
      setBusyId(null);
    }
  }

  if (questions === undefined) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (questions.length === 0) {
    return <p className="text-sm text-slate-500">No customer questions yet.</p>;
  }

  const pending = questions.filter((q) => q.status === "pending");
  const rest = questions.filter((q) => q.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Needs an answer <span className="text-slate-400">({pending.length})</span>
        </h2>
        {pending.length === 0 && <p className="text-sm text-slate-500">Nothing waiting on you.</p>}
        <div className="space-y-3">
          {pending.map((q) => (
            <div key={q._id} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{q.question}</p>
              <p className="mt-1 text-xs text-slate-500">
                {q.name} · on {productName(q.productId)}
              </p>
              {answering === q._id ? (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Your answer — this publishes it publicly on the product page."
                  />
                  {error && <p className="text-xs text-red-600">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswer(q._id)}
                      disabled={busyId === q._id}
                      className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Publish answer
                    </button>
                    <button
                      onClick={() => {
                        setAnswering(null);
                        setError(null);
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setAnswering(q._id);
                      setAnswerText("");
                      setError(null);
                    }}
                    className="rounded-lg bg-brand px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    Answer
                  </button>
                  <button
                    onClick={() => setStatus({ token, id: q._id, status: "hidden" })}
                    className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    Hide without answering
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    disabled={busyId === q._id}
                    className="rounded-lg border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {rest.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-slate-900">Answered / hidden</h2>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
            {rest.map((q) => (
              <div key={q._id} className="p-4">
                <p className="text-sm font-semibold text-slate-900">{q.question}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {q.name} · on {productName(q.productId)} ·{" "}
                  <span className={q.status === "published" ? "text-green-600" : "text-slate-400"}>
                    {q.status}
                  </span>
                </p>
                {q.answer && <p className="mt-2 text-sm text-slate-600">A: {q.answer}</p>}
                <div className="mt-2 flex gap-2">
                  {q.status !== "published" && q.answer && (
                    <button
                      onClick={() => setStatus({ token, id: q._id, status: "published" })}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Publish
                    </button>
                  )}
                  {q.status === "published" && (
                    <button
                      onClick={() => setStatus({ token, id: q._id, status: "hidden" })}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(q._id)}
                    disabled={busyId === q._id}
                    className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
