"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import CategoryBanner from "@/components/CategoryBanner";

function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for…."
          className="w-full rounded-full bg-slate-100 py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2.5 text-white transition-all hover:scale-105 hover:bg-slate-800 active:scale-95"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`overflow-hidden bg-brand px-4 text-center text-xs font-semibold text-white transition-all duration-300 ease-out sm:text-sm ${
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-12 py-2 opacity-100"
        }`}
      >
        Reserve your laptop online, pay &amp; collect at pickup — no card details needed.
      </div>

      <div
        className={`border-b transition-all duration-300 ease-out ${
          scrolled
            ? "border-slate-200/60 bg-white/75 shadow-[0_1px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center gap-3 px-4 transition-all duration-300 ease-out sm:gap-4 ${
            scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
          }`}
        >
          <Link
            href="/"
            className={`relative flex-shrink-0 transition-all duration-300 ease-out ${
              scrolled ? "h-12 w-44 sm:h-10 sm:w-36" : "h-[78px] w-[272px] sm:h-16 sm:w-56"
            }`}
          >
            <Image
              src="/logo.png"
              alt="FactoryBuyo"
              fill
              unoptimized
              priority
              className="object-contain object-left"
            />
          </Link>

          <SearchBar className="hidden md:flex flex-1 max-w-md" />

          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden items-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:inline-flex"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-2.5 px-4 pb-3 md:hidden">
          <SearchBar className="flex-1" />
          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex-shrink-0 rounded-full bg-whatsapp p-3 text-white shadow-sm transition-transform active:scale-90"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <CategoryBanner scrolled={scrolled} />
    </header>
  );
}
