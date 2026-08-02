const badges = [
  {
    title: "6-Month Warranty",
    desc: "On every laptop we sell",
    icon: (
      <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Zm0 2.2 6 2.25v4.55c0 4-2.7 7.4-6 8.9-3.3-1.5-6-4.9-6-8.9V6.45l6-2.25Z" />
    ),
  },
  {
    title: "Certified & Tested",
    desc: "40-point quality check",
    icon: (
      <path d="m9 16.2-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5L9 16.2Z" />
    ),
  },
  {
    title: "Pan-India Delivery",
    desc: "Shipped safely to your door",
    icon: (
      <path d="M3 4h11v9h2.5l3.5 4.2V17h-2a2.5 2.5 0 0 1-5 0H8.5a2.5 2.5 0 0 1-5 0H3V4Zm2 2v7h9V6H5Zm1.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm11 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM16 10.5v3.5h2.6l-2-2.4-.6-1.1Z" />
    ),
  },
  {
    title: "Reserve on WhatsApp",
    desc: "No card details needed",
    icon: (
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    ),
  },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.title} className="flex items-center gap-3 sm:flex-col sm:text-center">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 flex-shrink-0 fill-brand sm:h-8 sm:w-8"
              aria-hidden="true"
            >
              {badge.icon}
            </svg>
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
