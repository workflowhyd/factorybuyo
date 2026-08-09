import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

const specsValidator = v.object({
  cpu: v.optional(v.string()),
  gpu: v.optional(v.string()),
  ram: v.optional(v.string()),
  storage: v.optional(v.string()),
  display: v.optional(v.string()),
});

const conditionValidator = v.optional(
  v.union(v.literal("Good"), v.literal("Very Good"), v.literal("Excellent"))
);

const variantValidator = v.object({
  id: v.string(),
  label: v.string(),
  sku: v.string(),
  cpu: v.optional(v.string()),
  ram: v.optional(v.string()),
  storage: v.optional(v.string()),
  os: v.optional(v.string()),
  price: v.number(),
  originalPrice: v.optional(v.number()),
  priceSGD: v.optional(v.number()),
  originalPriceSGD: v.optional(v.number()),
  inStock: v.boolean(),
});

export const MAX_PRODUCTS = 20;

export const list = query({
  args: {
    category: v.optional(v.union(v.literal("gaming"), v.literal("refurbished"))),
  },
  handler: async (ctx, { category }) => {
    if (category) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const getSimilar = query({
  args: { productId: v.id("products"), limit: v.optional(v.number()) },
  handler: async (ctx, { productId, limit }) => {
    const product = await ctx.db.get(productId);
    if (!product) return [];
    const sameCategory = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", product.category))
      .collect();
    const others = sameCategory.filter((p) => p._id !== productId);
    others.sort((a, b) => {
      const aSameBrand = a.brand === product.brand ? 1 : 0;
      const bSameBrand = b.brand === product.brand ? 1 : 0;
      return bSameBrand - aSameBrand || b.createdAt - a.createdAt;
    });
    return others.slice(0, limit ?? 4);
  },
});

export const add = mutation({
  args: {
    token: v.string(),
    slug: v.string(),
    name: v.string(),
    category: v.union(v.literal("gaming"), v.literal("refurbished")),
    brand: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    priceSGD: v.optional(v.number()),
    originalPriceSGD: v.optional(v.number()),
    specs: specsValidator,
    conditionGrade: conditionValidator,
    images: v.array(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
    sku: v.optional(v.string()),
    highlights: v.optional(v.array(v.string())),
    included: v.optional(v.array(v.string())),
    variants: v.optional(v.array(variantValidator)),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const count = (await ctx.db.query("products").collect()).length;
    if (count >= MAX_PRODUCTS) {
      throw new Error(
        `Product limit reached (${MAX_PRODUCTS} max). Delete a product before adding a new one.`
      );
    }
    await ctx.db.insert("products", {
      slug: args.slug,
      name: args.name,
      category: args.category,
      brand: args.brand,
      price: args.price,
      originalPrice: args.originalPrice,
      priceSGD: args.priceSGD,
      originalPriceSGD: args.originalPriceSGD,
      specs: args.specs,
      conditionGrade: args.conditionGrade,
      images: args.images,
      featured: args.featured,
      inStock: args.inStock,
      sku: args.sku,
      highlights: args.highlights,
      included: args.included,
      variants: args.variants,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("products"),
    slug: v.string(),
    name: v.string(),
    category: v.union(v.literal("gaming"), v.literal("refurbished")),
    brand: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    priceSGD: v.optional(v.number()),
    originalPriceSGD: v.optional(v.number()),
    specs: specsValidator,
    conditionGrade: conditionValidator,
    images: v.array(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
    sku: v.optional(v.string()),
    highlights: v.optional(v.array(v.string())),
    included: v.optional(v.array(v.string())),
    variants: v.optional(v.array(variantValidator)),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.patch(args.id, {
      slug: args.slug,
      name: args.name,
      category: args.category,
      brand: args.brand,
      price: args.price,
      originalPrice: args.originalPrice,
      priceSGD: args.priceSGD,
      originalPriceSGD: args.originalPriceSGD,
      specs: args.specs,
      conditionGrade: args.conditionGrade,
      images: args.images,
      featured: args.featured,
      inStock: args.inStock,
      sku: args.sku,
      highlights: args.highlights,
      included: args.included,
      variants: args.variants,
    });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("products") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
