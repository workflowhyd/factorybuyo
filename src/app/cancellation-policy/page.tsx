import type { Metadata } from "next";
import { api } from "../../../convex/_generated/api";
import { convexServerClient } from "@/lib/convexServer";
import PolicyPageView from "@/components/PolicyPageView";

export async function generateMetadata(): Promise<Metadata> {
  const data = await convexServerClient.query(api.policy.getPage, { slug: "cancellation-policy" });
  return {
    title: data.page?.title ?? "Cancellation Policy",
    description:
      data.page?.intro ?? "Because FactoryBuyo doesn't take payment online, cancelling is simple.",
    alternates: { canonical: "/cancellation-policy" },
  };
}

export default function CancellationPolicyPage() {
  return <PolicyPageView slug="cancellation-policy" />;
}
