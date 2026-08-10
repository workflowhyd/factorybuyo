"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StorageImage from "@/components/StorageImage";
import { useMutation, useQuery } from "convex/react";
import { Check, Star, MessageCircleQuestion } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { formatPrice, discountPercent } from "@/lib/format";
import { getRegionalPrice, isAvailableInRegion } from "@/lib/pricing";
import { useRegion } from "@/context/RegionContext";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import WhatsAppReserveButton from "@/components/WhatsAppReserveButton";
import Reveal from "@/components/motion/Reveal";
import type { Doc } from "../../convex/_generated/dataModel";

const conditionDescriptions: Record<string, string> = {
  Good: "Visible signs of use — light scratches or marks possible. Fully tested and functional, 80%+ battery health.",
  "Very Good": "Minor wear only visible up close. Fully tested and functional, 85%+ battery health.",
  Excellent: "Minimal to no visible wear, close to like-new condition. Fully tested, 90%+ battery health.",
};

const specLabels: Record<string, string> = {
  cpu: "Processor",
  gpu: "Graphics",
  ram: "RAM",
  storage: "Storage",
  display: "Display",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{children}</h2>
  );
}

function AskQuestionForm({ productId }: { productId: Doc<"products">["_id"] }) {
  const submit = useMutation(api.productQuestions.submit);
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !question.trim()) {
      setError("Add your name and a question.");
      return;
    }
    setSending(true);
    try {
      await submit({ productId, name: name.trim(), question: question.trim() });
      setSent(true);
      setName("");
      setQuestion("");
    } catch {
      setError("Couldn't send that — try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Thanks — we&apos;ll review your question and post an answer here shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Ask a question</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      />
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What do you want to know about this laptop?"
        rows={2}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {sending ? "Sending…" : "Submit question"}
      </button>
      <p className="text-[11px] text-slate-400">
        Reviewed by our team before it appears publicly — we won&apos;t publish anything without checking it first.
      </p>
    </form>
  );
}

export default function ProductDetail({ slug }: { slug: string }) {
  const product = useQuery(api.products.getBySlug, { slug });
  const settings = useQuery(api.productDetailSettings.get, {});
  const [activeImage, setActiveImage] = useState(0);
  const { region } = useRegion();

  const [variantId, setVariantId] = useState<string | null>(null);

  const testimonials = useQuery(
    api.testimonials.listForProduct,
    product ? { productId: product._id } : "skip"
  );
  const questions = useQuery(
    api.productQuestions.listPublished,
    product ? { productId: product._id } : "skip"
  );
  const similar = useQuery(
    api.products.getSimilar,
    product ? { productId: product._id } : "skip"
  );

  useEffect(() => {
    if (product) {
      addRecentlyViewed({ slug: product.slug, name: product.name });
    }
  }, [product]);

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-16 text-slate-500">
        We couldn&apos;t find that laptop — it may have sold out. Browse our{" "}
        <a href="/gaming-laptops" className="text-brand underline">
          current lineup
        </a>
        .
      </p>
    );
  }

  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const selectedVariant = hasVariants
    ? (variants.find((v) => v.id === variantId) ?? variants[0])
    : null;

  const priceSource = selectedVariant ?? product;
  const available = isAvailableInRegion(priceSource, region);
  const { price, originalPrice } = getRegionalPrice(priceSource, region);
  const discount = discountPercent(price, originalPrice);
  const inStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const sku = selectedVariant?.sku ?? product.sku;

  const specs = Object.entries(product.specs).filter(([, value]) => value);
  const s = {
    showHighlights: settings?.showHighlights ?? true,
    showSpecs: settings?.showSpecs ?? true,
    showCondition: settings?.showCondition ?? true,
    showIncluded: settings?.showIncluded ?? true,
    showWarranty: settings?.showWarranty ?? true,
    showReviews: settings?.showReviews ?? true,
    showQA: settings?.showQA ?? true,
    showCompare: settings?.showCompare ?? true,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-50 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)]">
            {product.images[activeImage] && (
              <div className="absolute inset-6 sm:inset-8">
                <StorageImage
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-20 overflow-hidden rounded-xl border-2 bg-slate-50 transition-colors ${
                    activeImage === i ? "border-brand" : "border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="absolute inset-1.5">
                    <StorageImage src={img} alt="" fill unoptimized className="object-contain" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {product.brand}
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {product.name}
          </h1>

          {available ? (
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {formatPrice(price, region)}
              </span>
              {originalPrice && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(originalPrice, region)}
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white">
                  -{discount}% vs new
                </span>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold text-slate-500">
              Not available in this region — message us to check other options.
            </p>
          )}

          {product.conditionGrade && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-semibold text-slate-900">
                Condition: {product.conditionGrade}
              </p>
            </div>
          )}

          {hasVariants && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="mb-2.5 text-sm font-semibold text-slate-700">Configuration</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const selected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      disabled={!v.inStock}
                      className={`rounded-xl border-2 px-3.5 py-2 text-left text-xs font-semibold transition-colors ${
                        selected
                          ? "border-brand bg-brand/5 text-brand"
                          : v.inStock
                            ? "border-slate-200 text-slate-700 hover:border-slate-300"
                            : "cursor-not-allowed border-slate-100 text-slate-300"
                      }`}
                    >
                      {v.label}
                      {!v.inStock && <span className="block font-normal">Sold out</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {specs.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-slate-200 pt-6 text-sm">
              {specs.map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="text-slate-500">{specLabels[key] ?? key}</span>
                  <span className="font-medium text-slate-900">{value}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            {inStock && available ? (
              <WhatsAppReserveButton
                product={{
                  name: product.name,
                  price,
                  slug: product.slug,
                  conditionGrade: product.conditionGrade,
                }}
                configLabel={selectedVariant?.label}
                sku={sku}
              />
            ) : (
              <div className="rounded-full bg-slate-100 px-6 py-3.5 text-center text-sm font-semibold text-slate-500">
                {available ? "Currently sold out" : "Not available in this region"}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-500">
            {[
              "6-month warranty",
              "Certified & tested",
              "Doorstep delivery",
              "Reserve, no card needed",
            ].map((item) => (
              <p key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-brand" strokeWidth={2.5} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 space-y-14 sm:mt-20 sm:space-y-16">
        {s.showHighlights && product.highlights && product.highlights.length > 0 && (
          <Reveal>
            <SectionHeading>Product Highlights</SectionHeading>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2.5} />
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {s.showSpecs && specs.length > 0 && (
          <Reveal>
            <SectionHeading>Full Specifications</SectionHeading>
            <dl className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-slate-500">{specLabels[key] ?? key}</dt>
                  <dd className="font-medium text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {s.showCondition && product.conditionGrade && (
          <Reveal>
            <SectionHeading>Refurbished Condition</SectionHeading>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-900">{product.conditionGrade}</span> —{" "}
              {conditionDescriptions[product.conditionGrade]}
            </p>
          </Reveal>
        )}

        {s.showIncluded && product.included && product.included.length > 0 && (
          <Reveal>
            <SectionHeading>What&apos;s Included</SectionHeading>
            <ul className="mt-4 space-y-2">
              {product.included.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {s.showWarranty && (
          <Reveal>
            <SectionHeading>Warranty and Returns</SectionHeading>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Every laptop we sell is covered by a 6-month warranty from the day you collect or
              receive it. Since payment isn&apos;t collected online, cancelling a reservation
              before payment is free — see our{" "}
              <Link href="/terms-and-conditions" className="font-medium text-brand hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/cancellation-policy" className="font-medium text-brand hover:underline">
                Cancellation Policy
              </Link>{" "}
              for the full details.
            </p>
          </Reveal>
        )}

        {s.showReviews && testimonials && testimonials.length > 0 && (
          <Reveal>
            <SectionHeading>Customer Reviews</SectionHeading>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t._id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < t.rating ? "fill-brand text-brand" : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.quote}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {s.showQA && (
          <Reveal>
            <SectionHeading>Product Questions and Answers</SectionHeading>
            <div className="mt-4 space-y-4">
              {questions === undefined && (
                <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
              )}
              {questions && questions.length === 0 && (
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <MessageCircleQuestion className="h-4 w-4" />
                  No questions yet — be the first to ask.
                </p>
              )}
              {questions?.map((q) => (
                <div key={q._id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">Q: {q.question}</p>
                  <p className="mt-1 text-xs text-slate-400">— {q.name}</p>
                  {q.answer && (
                    <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">A:</span> {q.answer}
                    </p>
                  )}
                </div>
              ))}
              <AskQuestionForm productId={product._id} />
            </div>
          </Reveal>
        )}

        {s.showCompare && similar && similar.length > 0 && (
          <Reveal>
            <SectionHeading>Compare Similar Products</SectionHeading>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-2 pr-4 font-semibold">Model</th>
                    <th className="pb-2 pr-4 font-semibold">Processor</th>
                    <th className="pb-2 pr-4 font-semibold">RAM</th>
                    <th className="pb-2 pr-4 font-semibold">Storage</th>
                    <th className="pb-2 pr-4 font-semibold">Condition</th>
                    <th className="pb-2 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100 bg-brand/5">
                    <td className="py-2.5 pr-4 font-semibold text-slate-900">{product.name} (this one)</td>
                    <td className="py-2.5 pr-4 text-slate-600">{product.specs.cpu ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{product.specs.ram ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{product.specs.storage ?? "—"}</td>
                    <td className="py-2.5 pr-4 text-slate-600">{product.conditionGrade ?? "—"}</td>
                    <td className="py-2.5 font-semibold text-slate-900">
                      {available ? formatPrice(price, region) : "—"}
                    </td>
                  </tr>
                  {similar.map((p) => {
                    const pAvailable = isAvailableInRegion(p, region);
                    const { price: pPrice } = getRegionalPrice(p, region);
                    return (
                      <tr key={p._id} className="border-t border-slate-100">
                        <td className="py-2.5 pr-4">
                          <Link href={`/product/${p.slug}`} className="font-medium text-brand hover:underline">
                            {p.name}
                          </Link>
                        </td>
                        <td className="py-2.5 pr-4 text-slate-600">{p.specs.cpu ?? "—"}</td>
                        <td className="py-2.5 pr-4 text-slate-600">{p.specs.ram ?? "—"}</td>
                        <td className="py-2.5 pr-4 text-slate-600">{p.specs.storage ?? "—"}</td>
                        <td className="py-2.5 pr-4 text-slate-600">{p.conditionGrade ?? "—"}</td>
                        <td className="py-2.5 text-slate-900">
                          {pAvailable ? formatPrice(pPrice, region) : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
