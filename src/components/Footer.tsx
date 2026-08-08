import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">
            Factory<span className="text-brand">Buyo</span>
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Trending gaming laptops and certified pre-owned laptops, hand-picked for the Indian
            market. Reserve online, confirm on WhatsApp.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/gaming-laptops" className="hover:text-white">
                Gaming Laptops
              </Link>
            </li>
            <li>
              <Link href="/preowned-laptops" className="hover:text-white">
                Pre-Owned Laptops
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-white">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/cancellation-policy" className="hover:text-white">
                Cancellation Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FactoryBuyo. All rights reserved.
      </div>
    </footer>
  );
}
