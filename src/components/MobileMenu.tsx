"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
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
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const EASE = [0.16, 1, 0.3, 1] as const;

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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pathname = usePathname();
  const menu = useQuery(api.menu.getMenu, {});

  const categories = (menu?.categories ?? []).filter((c) => !c.hidden);
  const info = (menu?.info ?? []).filter((i) => !i.hidden);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex-shrink-0 rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-100 active:scale-95"
      >
        <Menu className="h-6 w-6" strokeWidth={1.8} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={close}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: EASE }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[80%] max-w-xs flex-col overflow-y-auto bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 active:scale-95"
                >
                  <X className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-2">
                {categories.map((cat) => {
                  const Icon = ICONS[cat.icon ?? ""] ?? Gamepad2;
                  const active = pathname === cat.href;
                  const expanded = expandedId === cat._id;
                  return (
                    <div key={cat._id}>
                      <div
                        className={`flex items-center rounded-xl transition-colors ${
                          active ? "bg-brand/10 text-brand" : "text-slate-800"
                        }`}
                      >
                        <Link
                          href={cat.href}
                          onClick={close}
                          className="flex flex-1 items-center gap-3 px-3 py-3.5 text-sm font-semibold hover:text-brand"
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.8} />
                          {cat.label}
                        </Link>
                        {cat.subitems.length > 0 && (
                          <button
                            type="button"
                            aria-label={expanded ? `Collapse ${cat.label}` : `Expand ${cat.label}`}
                            onClick={() => setExpandedId(expanded ? null : cat._id)}
                            className="p-3.5 text-slate-400 hover:text-slate-700"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {expanded && cat.subitems.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="ml-8 flex flex-col gap-0.5 pb-1.5 pt-0.5">
                              {cat.subitems.map((sub) => (
                                <Link
                                  key={sub._id}
                                  href={sub.href}
                                  onClick={close}
                                  className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-brand"
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <a
                  href={buildGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Need Help?
                </a>
              </nav>

              {info.length > 0 && (
                <div className="mt-2 border-t border-slate-100 px-2 pb-6 pt-3">
                  <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Support
                  </p>
                  <nav className="flex flex-col gap-0.5">
                    {info.map((item) => {
                      const Icon = ICONS[item.icon ?? ""] ?? Info;
                      return (
                        <Link
                          key={item._id}
                          href={item.href}
                          onClick={close}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-brand"
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
