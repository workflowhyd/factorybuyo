import { ConvexHttpClient } from "convex/browser";
import { cache } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set — required to fetch data at build time for static export."
  );
}

/** Build-time-only Convex client (generateStaticParams / generateMetadata /
 * server components). Never import this into a "use client" file. */
export const convexServerClient = new ConvexHttpClient(url);

/** Cached per-build so the same product isn't queried twice (once for
 * generateMetadata, once for the page body). */
export const getProductBySlug = cache(async (slug: string) => {
  return await convexServerClient.query(api.products.getBySlug, { slug });
});

export async function resolveImageUrl(src: string): Promise<string> {
  if (!src.startsWith("storage:")) return src;
  const storageId = src.slice("storage:".length) as Id<"_storage">;
  const resolved = await convexServerClient.query(api.files.getPublicUrl, { storageId });
  return resolved ?? "/logo.png";
}
