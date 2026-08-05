import Link from "next/link";
import { Flame } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { label: "Hot Deals", href: "/hot-deals", icon: Flame, className: "text-brand" },
  { label: "Gaming Laptops", href: "/gaming-laptops" },
  { label: "Refurbished Laptops", href: "/refurbished-laptops" },
];

export default function CategoryBanner({ scrolled = false }: { scrolled?: boolean }) {
  return (
    <div
      className={`border-b transition-all duration-300 ease-out ${
        scrolled
          ? "border-slate-200/60 bg-white/75 backdrop-blur-xl"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-3 text-sm font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative flex items-center gap-1.5 py-1 transition-colors hover:text-brand ${
              link.className ?? "text-slate-700"
            }`}
          >
            {link.icon && <link.icon className="h-4 w-4" />}
            {link.label}
            <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </Link>
        ))}
        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative py-1 text-brand-purple sm:ml-auto"
        >
          Need help?
          <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </a>
      </div>
    </div>
  );
}
