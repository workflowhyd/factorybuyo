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
    desc: "Every laptop we sell — gaming or pre-owned — is covered for 6 months from the day you collect it.",
    icon: ShieldCheck,
  },
  {
    title: "Reserve, No Card Needed",
    desc: "Message us on WhatsApp to confirm stock and pricing, then pay and collect in person — no online payment required.",
    icon: MessageCircle,
  },
  {
    title: "Doorstep Delivery",
    desc: "Can't collect in person? We'll ship your laptop safely to your door, in India or Singapore.",
    icon: Truck,
  },
];

export default function WhyFactoryBuyo() {
  return (
    <section className="bg-gradient-to-b from-[#faf6fd] to-[#f3ecf9] py-14 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-purple sm:text-xs">
            Why FactoryBuyo
          </p>
          <h2 className="mt-2.5 text-xl font-bold tracking-tight text-slate-900 sm:mt-3 sm:text-3xl">
            Built around trust, not just deals
          </h2>
        </Reveal>
        <StaggerGroup className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8">
          {features.map((feature) => (
            <StaggerItem key={feature.title} className="group text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-purple shadow-[0_8px_24px_-10px_rgba(91,31,143,0.35)] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 sm:h-14 sm:w-14">
                <feature.icon className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={1.6} aria-hidden="true" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-slate-900 sm:mt-5 sm:text-sm">
                {feature.title}
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-slate-500 sm:mt-2.5 sm:text-sm">
                {feature.desc}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
