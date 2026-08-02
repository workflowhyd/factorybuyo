const features = [
  {
    title: "Certified & Tested",
    desc: "Every laptop passes a 40-point check before it's listed — screen, battery, keyboard, ports, performance.",
    icon: (
      <path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5L9 16.2Z" />
    ),
  },
  {
    title: "6-Month Warranty",
    desc: "Every laptop we sell — gaming or refurbished — is covered for 6 months from the day you collect it.",
    icon: (
      <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Zm0 2.2 6 2.25v4.55c0 4-2.7 7.4-6 8.9-3.3-1.5-6-4.9-6-8.9V6.45l6-2.25Z" />
    ),
  },
  {
    title: "Reserve, No Card Needed",
    desc: "Message us on WhatsApp to confirm stock and pricing, then pay and collect in person — no online payment required.",
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
    ),
  },
  {
    title: "Pan-India Delivery",
    desc: "Can't collect in person? We'll ship your laptop safely to your door, anywhere in India.",
    icon: (
      <path d="M3 4h11v9h2.5l3.5 4.2V17h-2a2.5 2.5 0 0 1-5 0H8.5a2.5 2.5 0 0 1-5 0H3V4Zm2 2v7h9V6H5Zm1.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm11 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM16 10.5v3.5h2.6l-2-2.4-.6-1.1Z" />
    ),
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
              <svg
                viewBox="0 0 24 24"
                className="mx-auto h-9 w-9 fill-brand-purple"
                aria-hidden="true"
              >
                {feature.icon}
              </svg>
              <p className="mt-4 text-sm font-bold text-slate-900">{feature.title}</p>
              <p className="mx-auto mt-2 max-w-xs text-xs text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
