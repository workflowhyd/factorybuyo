import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { convexServerClient, getProductBySlug, resolveImageUrl } from "@/lib/convexServer";
import { formatPrice } from "@/lib/format";
import ProductDetail from "@/components/ProductDetail";

export async function generateStaticParams() {
  const products = await convexServerClient.query(api.products.list, {});
  return products.map((p) => ({ slug: p.slug }));
}

function buildDescription(product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>): string {
  const specsLine = [product.specs.cpu, product.specs.ram, product.specs.storage]
    .filter(Boolean)
    .join(", ");
  const conditionLine = product.conditionGrade ? `${product.conditionGrade} condition. ` : "";
  return `${conditionLine}${specsLine ? specsLine + ". " : ""}${formatPrice(product.price, "IN")} at FactoryBuyo — certified, 6-month warranty, reserve on WhatsApp.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Laptop Not Found" };
  }

  const description = buildDescription(product);
  const image = product.images[0] ? await resolveImageUrl(product.images[0]) : "/logo.png";
  const url = `/product/${product.slug}`;

  return {
    title: `${product.name} — Buy Now`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const specsList = Object.values(product.specs).filter(Boolean).join(", ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: `${product.conditionGrade ? product.conditionGrade + " condition. " : ""}${specsList}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://factorybuyo.com/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail slug={slug} />
    </>
  );
}
