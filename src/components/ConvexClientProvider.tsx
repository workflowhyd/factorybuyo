"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl && typeof window !== "undefined") {
  console.error(
    "NEXT_PUBLIC_CONVEX_URL is not set — the site will build but won't be able to load product data until it's configured."
  );
}

const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
