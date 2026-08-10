import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "FactoryBuyo sells trending gaming laptops and certified pre-owned laptops to customers in India and Singapore — tested, graded, and backed by a 6-month warranty.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutPage />;
}
