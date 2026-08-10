import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "The best ways to reach FactoryBuyo — WhatsApp, email, and the markets we serve.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
