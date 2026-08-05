import { BadgeCheck, ShieldCheck, MessageCircle, Truck } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const features = [
  {
    title: "Certified & Tested",
    desc: "Every laptop passes a 40-point check before it's listed — screen, battery, keyboard, ports, performance.",
    icon: BadgeCheck,
  },
  {
    title: "6-Month Warranty",
    desc: "Every laptop we sell — gaming or refurbished — is covered for 6 months from the day you collect it.",
    icon: ShieldCheck,
  },
  {
    title: "Reserve, No Card Needed",
    desc: "Message us on WhatsApp to confirm stock and pricing, then pay and collect in person — no online payment required.",
    icon: MessageCircle,
  },
  {
    title: "Pan-India Delivery",
    desc: "Can't collect in person? We'll ship your laptop safely to your door, anywhere in India.",
    icon: Truck,
  },
];

export default function WhyFactoryBuyo() {
  return (
    <section className="bg-gradient-to-b from-[#faf6fd] to-[#f3ecf9] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-purple">
            Why FactoryBuyo
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Built around trust, not just deals
          </h2>
        </Reveal>
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => (
            <StaggerItem key={feature.title} className="group text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-purple shadow-[0_8px_24px_-10px_rgba(91,31,143,0.35)] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <feature.icon className="h-7 w-7" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-semibold text-slate-900">{feature.title}</p>
              <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
