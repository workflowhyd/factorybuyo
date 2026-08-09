"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Gamepad2,
  Recycle,
  Flame,
  Info,
  FileText,
  RotateCcw,
  ShieldCheck,
  Mail,
  HelpCircle,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import RegionSwitcher from "@/components/RegionSwitcher";

const ICONS: Record<string, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Gamepad2,
  Recycle,
  Flame,
  Info,
  FileText,
  RotateCcw,
  ShieldCheck,
  Mail,
  HelpCircle,
};

export default function CategoryBanner({ scrolled = false }: { scrolled?: boolean }) {
  const pathname = usePathname();
  const menu = useQuery(api.menu.getMenu, {});
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const categories = (menu?.categories ?? []).filter((c) => !c.hidden);
  const info = (menu?.info ?? []).filter((i) => !i.hidden);
  const shopActive = categories.some((c) => c.href === pathname);

  return (
    <div
      className={`border-b transition-all duration-300 ease-out ${
        scrolled
          ? "border-slate-200/60 bg-white/75 backdrop-blur-xl"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 py-3 text-sm font-semibold">
        <div
          className="relative hidden md:block"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            onFocus={openNow}
            aria-expanded={open}
            aria-haspopup="true"
            className={`flex items-center gap-1 py-1 transition-colors hover:text-brand ${
              open || shopActive ? "text-brand" : "text-slate-700"
            }`}
          >
            Shop
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (categories.length > 0 || info.length > 0) && (
            <div
              onMouseEnter={openNow}
              onMouseLeave={closeSoon}
              className="absolute left-0 top-full z-40 mt-3 flex w-[560px] gap-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.25)]"
            >
              {categories.length > 0 && (
                <div className="flex-1">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Shop
                  </p>
                  <div className="space-y-4">
                    {categories.map((cat) => {
                      const Icon = ICONS[cat.icon ?? ""] ?? Gamepad2;
                      const active = cat.href === pathname;
                      return (
                        <div key={cat._id}>
                          <Link
                            href={cat.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-2 rounded-lg font-semibold transition-colors ${
                              active ? "text-brand" : "text-slate-900 hover:text-brand"
                            }`}
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                            {cat.label}
                          </Link>
                          {cat.subitems.length > 0 && (
                            <div className="ml-6 mt-1.5 space-y-1">
                              {cat.subitems.map((sub) => (
                                <Link
                                  key={sub._id}
                                  href={sub.href}
                                  onClick={() => setOpen(false)}
                                  className="block text-xs font-normal text-slate-500 hover:text-brand"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {categories.length > 0 && info.length > 0 && <div className="w-px bg-slate-100" />}

              {info.length > 0 && (
                <div className="flex-1">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Support
                  </p>
                  <div className="space-y-2.5">
                    {info.map((item) => {
                      const Icon = ICONS[item.icon ?? ""] ?? Info;
                      return (
                        <Link
                          key={item._id}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 text-sm font-normal text-slate-600 hover:text-brand"
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-brand-purple hover:underline md:ml-auto md:block"
        >
          Need help?
        </a>

        <RegionSwitcher className="ml-auto md:ml-2" />
      </div>
    </div>
  );
}
