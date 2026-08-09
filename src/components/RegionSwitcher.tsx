"use client";

import { useRegion } from "@/context/RegionContext";

const FALLBACK = [
  { code: "IN" as const, label: "🇮🇳 INR" },
  { code: "SG" as const, label: "🇸🇬 SGD" },
];

export default function RegionSwitcher({ className }: { className?: string }) {
  const { region, setRegion, allSettings } = useRegion();

  const regions = allSettings
    ? allSettings.filter((s) => s.enabled).map((s) => ({ code: s.code, label: `${s.flag} ${s.label}` }))
    : FALLBACK;

  return (
    <div
      className={`flex flex-shrink-0 items-center rounded-full bg-slate-100 p-0.5 text-xs font-semibold ${className ?? ""}`}
    >
      {regions.map((r) => (
        <button
          key={r.code}
          type="button"
          onClick={() => setRegion(r.code)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            region === r.code
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
