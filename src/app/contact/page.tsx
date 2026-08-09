"use client";

import { Mail, MessageCircle, Globe, Phone, Clock, MapPin, Truck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PolicyPage from "@/components/PolicyPage";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { useRegion } from "@/context/RegionContext";

export default function ContactPage() {
  const info = useQuery(api.contact.get, {});
  const { settings, whatsappNumber } = useRegion();

  const channels = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      detail: "Fastest way to reach us — reserve a laptop, ask a question, or get support.",
      action: { text: "Message us on WhatsApp", href: buildGeneralWhatsAppLink(whatsappNumber) },
    },
    settings?.deliveryNote
      ? { icon: Truck, label: `Delivery — ${settings.label}`, detail: settings.deliveryNote, action: null }
      : null,
    {
      icon: Mail,
      label: "Email",
      detail: "For anything that isn't urgent, or if you'd rather not use WhatsApp.",
      action: {
        text: info?.email ?? "contact@factorybuyo.com",
        href: `mailto:${info?.email ?? "contact@factorybuyo.com"}`,
      },
    },
    info?.phone
      ? { icon: Phone, label: "Phone", detail: info.phone, action: null }
      : null,
    info?.hours
      ? { icon: Clock, label: "Operating hours", detail: info.hours, action: null }
      : null,
    info?.address
      ? { icon: MapPin, label: "Address", detail: info.address, action: null }
      : null,
    {
      icon: Globe,
      label: "Markets we serve",
      detail:
        info?.marketsNote ??
        "We currently sell to customers in India and Singapore, with pricing shown in INR and SGD.",
      action: null,
    },
  ].filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <PolicyPage title="Contact Information" intro="The best ways to reach FactoryBuyo.">
      <div className="grid gap-5 sm:grid-cols-3">
        {channels.map((c) => (
          <div key={c.label} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-purple shadow-sm">
              <c.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{c.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.detail}</p>
            {c.action && (
              <a
                href={c.action.href}
                target={c.action.href.startsWith("http") ? "_blank" : undefined}
                rel={c.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-3 inline-block text-xs font-semibold text-brand hover:underline"
              >
                {c.action.text} →
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Looking for warranty or order support? Message us on WhatsApp with your order
        details and we&apos;ll take it from there.
      </p>
    </PolicyPage>
  );
}
