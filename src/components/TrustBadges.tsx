import { ShieldCheck, BadgeCheck, Truck, MessageCircle } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

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
    <section className="border-y border-slate-100 bg-slate-50/60">
      <StaggerGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4 sm:gap-8 sm:py-14">
        {badges.map((badge) => (
          <StaggerItem key={badge.title} className="group flex items-center gap-3.5 sm:flex-col sm:text-center">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/10 to-brand-purple/10 text-brand transition-transform duration-300 ease-out group-hover:scale-110 sm:h-14 sm:w-14">
              <badge.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.6} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{badge.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
