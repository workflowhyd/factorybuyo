import type { Metadata } from "next";
import { api } from "../../../convex/_generated/api";
import { convexServerClient } from "@/lib/convexServer";
import PolicyPageView from "@/components/PolicyPageView";

export async function generateMetadata(): Promise<Metadata> {
  const data = await convexServerClient.query(api.policy.getPage, { slug: "privacy-policy" });
  return {
    title: data.page?.title ?? "Privacy Policy",
    description: data.page?.intro ?? "How FactoryBuyo collects, uses and protects your information.",
    alternates: { canonical: "/privacy-policy" },
  };
}

export default function PrivacyPolicyPage() {
  return <PolicyPageView slug="privacy-policy" />;
}
