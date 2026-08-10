import type { Metadata } from "next";
import HotDealsPage from "@/components/HotDealsPage";

export const metadata: Metadata = {
  title: "Hot Deals",
  description: "Every laptop currently priced below its original listing on FactoryBuyo — biggest discounts first.",
  alternates: { canonical: "/hot-deals" },
};

export default function HotDeals() {
  return <HotDealsPage />;
}
