import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-white">
            Factory<span className="text-brand">Buyo</span>
          </p>
          <p className="mt-3 text-sm text-slate-400">
            Trending gaming laptops and certified refurbished laptops, hand-picked for the Indian
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
              <Link href="/refurbished-laptops" className="hover:text-white">
                Refurbished Laptops
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>WhatsApp: reserve any product to start a chat</li>
            <li>Email: contact@factorybuyo.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} FactoryBuyo. All rights reserved.
      </div>
    </footer>
  );
}
