import Link from "next/link";
import { Flame } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { label: "Hot Deals", href: "/hot-deals", icon: Flame, className: "text-brand" },
  { label: "Gaming Laptops", href: "/gaming-laptops" },
  { label: "Refurbished Laptops", href: "/refurbished-laptops" },
];

export default function CategoryBanner() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-3 text-sm font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 transition-colors hover:text-brand ${
              link.className ?? "text-slate-700"
            }`}
          >
            {link.icon && <link.icon className="h-4 w-4" />}
            {link.label}
          </Link>
        ))}
        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-purple hover:underline sm:ml-auto"
        >
          Need help?
        </a>
      </div>
    </div>
  );
}
