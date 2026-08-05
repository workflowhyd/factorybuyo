import Link from "next/link";
import { Gamepad2, Recycle } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

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
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <Reveal>
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Shop FactoryBuyo
        </h2>
      </Reveal>
      <StaggerGroup className="grid grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => (
          <StaggerItem key={cat.label}>
            <Link
              href={cat.href}
              target={cat.external ? "_blank" : undefined}
              rel={cat.external ? "noopener noreferrer" : undefined}
              className="group flex h-full flex-col items-center justify-center gap-3.5 rounded-2xl bg-slate-50 px-3 py-8 text-center ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-16px_rgba(58,14,109,0.25)] hover:ring-slate-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/10 to-brand-purple/10 text-brand transition-transform duration-300 ease-out group-hover:scale-110 sm:h-14 sm:w-14">
                <cat.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold text-slate-900 sm:text-sm">{cat.label}</span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
