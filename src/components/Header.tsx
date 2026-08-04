"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
          className="w-full rounded-full bg-slate-100 py-2.5 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2 text-white transition-colors hover:bg-slate-800"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-brand text-white text-xs sm:text-sm font-semibold text-center py-2 px-4">
        Reserve your laptop online, pay &amp; collect at pickup — no card details needed.
      </div>

      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <Link href="/" className="relative h-14 w-48 flex-shrink-0 sm:h-16 sm:w-56">
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
            className="ml-auto hidden sm:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Chat on WhatsApp
          </a>
          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="ml-auto rounded-full bg-whatsapp p-2.5 text-white sm:hidden"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="px-4 pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>

      <CategoryBanner />
    </header>
  );
}
