import type { MetadataRoute } from "next";
import { api } from "../../convex/_generated/api";
import { convexServerClient } from "@/lib/convexServer";

export const dynamic = "force-static";

const SITE_URL = "https://factorybuyo.com";

const STATIC_ROUTES = [
  "",
  "/gaming-laptops",
  "/preowned-laptops",
  "/hot-deals",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-and-conditions",
  "/cancellation-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await convexServerClient.query(api.products.list, {});

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
    })),
  ];
}
