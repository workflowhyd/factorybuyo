"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

function isAbsoluteUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

const rawConvexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexUrl = isAbsoluteUrl(rawConvexUrl) ? rawConvexUrl : "https://placeholder.convex.cloud";

if (convexUrl === "https://placeholder.convex.cloud" && typeof window !== "undefined") {
  console.error(
    `NEXT_PUBLIC_CONVEX_URL is not a valid absolute URL (got: ${JSON.stringify(
      rawConvexUrl
    )}) — the site will run but won't be able to load product data until it's configured correctly.`
  );
}

const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
