import Link from "next/link";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const categories = [
  {
    label: "Gaming Laptops",
    href: "/gaming-laptops",
    icon: (
      <path d="M6 8h12a3 3 0 0 1 3 3l1 6a2 2 0 0 1-3.5 1.6L16 16H8l-2.5 2.6A2 2 0 0 1 2 17l1-6a3 3 0 0 1 3-3Zm2.5 2.5v1.5H7v1.5h1.5V15H10v-1.5h1.5V12H10v-1.5H8.5ZM16 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm2.5 2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    ),
  },
  {
    label: "Refurbished Laptops",
    href: "/refurbished-laptops",
    icon: (
      <path d="M12 4a8 8 0 0 1 7.4 4.9l1.4-1.4.7.7-2.6 2.6-2.6-2.6.7-.7 1.3 1.3A7 7 0 1 0 19 12h1a8 8 0 1 1-8-8Zm-.5 3H12v4.3l3.4 2-.5.9L11 12V7Z" />
    ),
  },
  {
    label: "Reserve on WhatsApp",
    href: buildGeneralWhatsAppLink(),
    external: true,
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    ),
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
            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 px-3 py-6 text-center transition-colors hover:bg-slate-100"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-brand sm:h-9 sm:w-9" aria-hidden="true">
              {cat.icon}
            </svg>
            <span className="text-xs font-semibold text-slate-900 sm:text-sm">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
