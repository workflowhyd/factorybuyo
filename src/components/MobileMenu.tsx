"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Flame, Gamepad2, Recycle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const EASE = [0.16, 1, 0.3, 1] as const;

const links = [
  { label: "Hot Deals", href: "/hot-deals", icon: Flame },
  { label: "Gaming Laptops", href: "/gaming-laptops", icon: Gamepad2 },
  { label: "Refurbished Laptops", href: "/refurbished-laptops", icon: Recycle },
  { label: "Need Help?", href: buildGeneralWhatsAppLink(), icon: WhatsAppIcon, external: true },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: EASE }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[80%] max-w-xs flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Menu
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 active:scale-95"
                >
                  <X className="h-5 w-5" strokeWidth={1.8} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-2">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold transition-colors ${
                        active ? "bg-brand/10 text-brand" : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <link.icon className="h-5 w-5" strokeWidth={1.8} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
