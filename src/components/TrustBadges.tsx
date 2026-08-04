import { ShieldCheck, BadgeCheck, Truck, MessageCircle } from "lucide-react";

const badges = [
  {
    title: "6-Month Warranty",
    desc: "On every laptop we sell",
    icon: ShieldCheck,
  },
  {
    title: "Certified & Tested",
    desc: "40-point quality check",
    icon: BadgeCheck,
  },
  {
    title: "Pan-India Delivery",
    desc: "Shipped safely to your door",
    icon: Truck,
  },
  {
    title: "Reserve on WhatsApp",
    desc: "No card details needed",
    icon: MessageCircle,
  },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-3 sm:flex-col sm:text-center">
            <badge.icon
              className="h-7 w-7 flex-shrink-0 text-brand sm:h-8 sm:w-8"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{badge.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
