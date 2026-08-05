import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";

export default function GamingLaptopsBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-2">
      <Reveal>
        <Link
          href="/gaming-laptops"
          className="group relative block overflow-hidden rounded-3xl shadow-[0_24px_60px_-24px_rgba(58,14,109,0.4)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_32px_70px_-20px_rgba(58,14,109,0.5)]"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/gaming-laptops-banner.jpg"
              alt="Popular gaming laptops — high performance, epic gameplay"
              fill
              unoptimized
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
