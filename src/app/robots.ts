import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/search"],
      },
    ],
    sitemap: "https://factorybuyo.com/sitemap.xml",
  };
}
