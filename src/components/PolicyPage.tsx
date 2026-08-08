import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";

export default function PolicyPage({
  title,
  intro,
  lastUpdated,
  children,
}: {
  title: string;
  intro?: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="border-b border-slate-100 bg-gradient-to-b from-[#faf6fd] to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Reveal>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {intro && (
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-500 sm:mt-2.5 sm:text-sm">
                {intro}
              </p>
            )}
            {lastUpdated && (
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Last updated {lastUpdated}
              </p>
            )}
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">{children}</div>
    </div>
  );
}

/** Prose styling for long-form legal/policy content — opt in per page so it
 * never leaks onto non-prose layouts (cards, grids) rendered inside PolicyPage. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[15px] leading-relaxed text-slate-600
        [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h2]:first:mt-0
        [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900
        [&_p]:mb-4
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5
        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5
        [&_li]:leading-relaxed
        [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2
        [&_strong]:font-semibold [&_strong]:text-slate-900"
    >
      {children}
    </div>
  );
}
