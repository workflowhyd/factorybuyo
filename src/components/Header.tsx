"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const navLinks = [
  { href: "/gaming-laptops", label: "Gaming Laptops" },
  { href: "/refurbished-laptops", label: "Refurbished Laptops" },
];

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m21 21-4.3-4.3" />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

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
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 p-2 text-white"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="bg-brand text-white text-xs sm:text-sm font-semibold text-center py-2 px-4">
        Reserve your laptop online, pay &amp; collect at pickup — no card details needed.
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <button
          className="md:hidden rounded-md p-2 -ml-2 text-slate-700 hover:bg-slate-100"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link
          href="/"
          className="flex-1 text-center text-xl font-extrabold tracking-tight text-slate-900 md:flex-none md:text-left"
        >
          Factory<span className="text-brand">Buyo</span>
        </Link>

        <SearchBar className="hidden md:flex flex-1 max-w-md" />

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-slate-700 hover:text-brand transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Chat on WhatsApp
        </a>
        <a
          href={buildGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="sm:hidden rounded-full bg-whatsapp p-2.5 text-white"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
