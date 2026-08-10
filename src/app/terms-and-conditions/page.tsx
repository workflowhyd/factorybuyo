import type { Metadata } from "next";
import { api } from "../../../convex/_generated/api";
import { convexServerClient } from "@/lib/convexServer";
import PolicyPageView from "@/components/PolicyPageView";

export async function generateMetadata(): Promise<Metadata> {
  const data = await convexServerClient.query(api.policy.getPage, { slug: "terms-and-conditions" });
  return {
    title: data.page?.title ?? "Terms and Conditions",
    description:
      data.page?.intro ?? "The terms that apply when you browse or reserve a laptop through FactoryBuyo.",
    alternates: { canonical: "/terms-and-conditions" },
  };
}

export default function TermsAndConditionsPage() {
  return <PolicyPageView slug="terms-and-conditions" />;
}
