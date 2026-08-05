"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import RegionSwitcher from "@/components/RegionSwitcher";

const links = [
  { label: "Hot Deals", href: "/hot-deals", icon: Flame, className: "text-brand" },
  { label: "Gaming Laptops", href: "/gaming-laptops" },
  { label: "Refurbished Laptops", href: "/refurbished-laptops" },
];

export default function CategoryBanner({ scrolled = false }: { scrolled?: boolean }) {
  const pathname = usePathname();

  return (
    <div
      className={`border-b transition-all duration-300 ease-out ${
        scrolled
          ? "border-slate-200/60 bg-white/75 backdrop-blur-xl"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto whitespace-nowrap px-2.5 py-1 text-sm font-semibold [scrollbar-width:none] snap-x snap-proximity scroll-smooth [&::-webkit-scrollbar]:hidden sm:gap-8 sm:px-4 sm:py-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex flex-shrink-0 snap-start items-center gap-1.5 px-2.5 py-3 transition-colors hover:text-brand sm:px-0 sm:py-1 ${
                active ? "text-brand" : (link.className ?? "text-slate-700")
              }`}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
              <span
                className={`absolute bottom-1.5 left-2.5 right-2.5 h-[1.5px] origin-left bg-current transition-transform duration-300 ease-out sm:bottom-[-2px] sm:left-0 sm:right-0 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          );
        })}
        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex-shrink-0 snap-start px-2.5 py-3 text-brand-purple sm:ml-auto sm:px-0 sm:py-1"
        >
          Need help?
          <span className="absolute bottom-1.5 left-2.5 right-2.5 h-[1.5px] origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 sm:bottom-[-2px] sm:left-0 sm:right-0" />
        </a>
        <RegionSwitcher className="ml-1 sm:ml-2" />
      </div>
    </div>
  );
}
