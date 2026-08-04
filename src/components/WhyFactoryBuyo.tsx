import { BadgeCheck, ShieldCheck, MessageCircle, Truck } from "lucide-react";

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
    <section className="bg-[#f7f0fb] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-xl font-extrabold uppercase tracking-wide text-slate-900 sm:text-2xl">
          Why buy from FactoryBuyo
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <feature.icon
                className="mx-auto h-9 w-9 text-brand-purple"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <p className="mt-4 text-sm font-bold text-slate-900">{feature.title}</p>
              <p className="mx-auto mt-2 max-w-xs text-xs text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
