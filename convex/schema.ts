import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    slug: v.string(),
    name: v.string(),
    category: v.union(v.literal("gaming"), v.literal("refurbished")),
    brand: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    priceSGD: v.optional(v.number()),
    originalPriceSGD: v.optional(v.number()),
    specs: v.object({
      cpu: v.optional(v.string()),
      gpu: v.optional(v.string()),
      ram: v.optional(v.string()),
      storage: v.optional(v.string()),
      display: v.optional(v.string()),
    }),
    conditionGrade: v.optional(
      v.union(v.literal("Good"), v.literal("Very Good"), v.literal("Excellent"))
    ),
    images: v.array(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  sessions: defineTable({
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  testimonials: defineTable({
    name: v.string(),
    quote: v.string(),
    rating: v.number(),
    createdAt: v.number(),
  }),

  trustBadges: defineTable({
    icon: v.string(),
    title: v.string(),
    desc: v.string(),
    href: v.optional(v.string()),
    order: v.number(),
    hidden: v.boolean(),
  }),

  aboutHero: defineTable({
    eyebrow: v.string(),
    title: v.string(),
    subtitle: v.string(),
  }),

  aboutPanels: defineTable({
    title: v.string(),
    body: v.string(),
    order: v.number(),
    hidden: v.boolean(),
  }),

  contactInfo: defineTable({
    email: v.string(),
    marketsNote: v.string(),
    phone: v.optional(v.string()),
    hours: v.optional(v.string()),
    address: v.optional(v.string()),
  }),

  policyPages: defineTable({
    slug: v.union(
      v.literal("privacy-policy"),
      v.literal("terms-and-conditions"),
      v.literal("cancellation-policy")
    ),
    title: v.string(),
    intro: v.optional(v.string()),
    lastUpdated: v.string(),
  }).index("by_slug", ["slug"]),

  policySections: defineTable({
    pageSlug: v.string(),
    heading: v.string(),
    body: v.string(),
    order: v.number(),
  }).index("by_page", ["pageSlug"]),

  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    order: v.number(),
    hidden: v.boolean(),
  }),

  faqSettings: defineTable({
    heading: v.string(),
    intro: v.optional(v.string()),
    defaultOpenId: v.optional(v.id("faqs")),
    ctaEnabled: v.boolean(),
    ctaText: v.string(),
  }),

  brands: defineTable({
    name: v.string(),
    logo: v.string(),
    order: v.number(),
    hidden: v.boolean(),
    mode: v.union(v.literal("auto"), v.literal("manual")),
    matchBrand: v.optional(v.string()),
    matchCategory: v.optional(v.union(v.literal("gaming"), v.literal("refurbished"))),
    sortBy: v.union(v.literal("newest"), v.literal("featured"), v.literal("default")),
    onlyInStock: v.boolean(),
    visibleCount: v.number(),
    productIds: v.array(v.id("products")),
  }),

  brandSwitcherSettings: defineTable({
    heading: v.string(),
    intro: v.optional(v.string()),
    ctaLabel: v.string(),
    ctaHref: v.string(),
  }),

  menuItems: defineTable({
    kind: v.union(v.literal("category"), v.literal("info")),
    label: v.string(),
    href: v.string(),
    icon: v.optional(v.string()),
    order: v.number(),
    hidden: v.boolean(),
  }),

  menuSubitems: defineTable({
    parentId: v.id("menuItems"),
    label: v.string(),
    href: v.string(),
    order: v.number(),
  }).index("by_parent", ["parentId"]),

  regionSettings: defineTable({
    code: v.union(v.literal("IN"), v.literal("SG")),
    label: v.string(),
    flag: v.string(),
    whatsappNumber: v.optional(v.string()),
    bannerText: v.string(),
    deliveryNote: v.optional(v.string()),
    marketNotice: v.optional(v.string()),
    enabled: v.boolean(),
  }).index("by_code", ["code"]),
});
