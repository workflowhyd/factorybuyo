import Link from "next/link";
import { Gamepad2, Recycle } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const categories = [
  {
    label: "Gaming Laptops",
    href: "/gaming-laptops",
    icon: Gamepad2,
  },
  {
    label: "Refurbished Laptops",
    href: "/refurbished-laptops",
    icon: Recycle,
  },
  {
    label: "Reserve on WhatsApp",
    href: buildGeneralWhatsAppLink(),
    external: true,
    icon: WhatsAppIcon,
  },
];

export default function CategoryRail() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-5 text-lg font-extrabold uppercase tracking-wide text-slate-900">
        Shop FactoryBuyo
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            target={cat.external ? "_blank" : undefined}
            rel={cat.external ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 px-3 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md"
          >
            <cat.icon
              className="h-8 w-8 text-brand sm:h-9 sm:w-9"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-slate-900 sm:text-sm">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
