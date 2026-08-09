import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const brands = await ctx.db.query("brands").collect();
    return brands.sort((a, b) => a.order - b.order);
  },
});

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("brandSwitcherSettings").first();
  },
});

export const updateSettings = mutation({
  args: { token: v.string(), heading: v.string(), intro: v.optional(v.string()), ctaLabel: v.string(), ctaHref: v.string() },
  handler: async (ctx, { token, heading, intro, ctaLabel, ctaHref }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("brandSwitcherSettings").first();
    const data = { heading, intro, ctaLabel, ctaHref };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("brandSwitcherSettings", data);
    }
  },
});

export const productsForBrand = query({
  args: { brandId: v.id("brands") },
  handler: async (ctx, { brandId }) => {
    const brand = await ctx.db.get(brandId);
    if (!brand) return [];

    if (brand.mode === "manual") {
      const products = await Promise.all(brand.productIds.map((id) => ctx.db.get(id)));
      return products.filter((p): p is NonNullable<typeof p> => p !== null);
    }

    const matchBrand = (brand.matchBrand ?? brand.name).trim().toLowerCase();
    let products = await ctx.db.query("products").collect();
    products = products.filter((p) => p.brand.trim().toLowerCase() === matchBrand);
    if (brand.matchCategory) {
      products = products.filter((p) => p.category === brand.matchCategory);
    }
    if (brand.onlyInStock) {
      products = products.filter((p) => p.inStock);
    }
    if (brand.sortBy === "newest") {
      products = products.slice().sort((a, b) => b.createdAt - a.createdAt);
    } else if (brand.sortBy === "featured") {
      products = products
        .slice()
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt);
    }
    return products.slice(0, brand.visibleCount);
  },
});

export const add = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    logo: v.string(),
    mode: v.union(v.literal("auto"), v.literal("manual")),
    matchBrand: v.optional(v.string()),
    matchCategory: v.optional(v.union(v.literal("gaming"), v.literal("refurbished"))),
    sortBy: v.union(v.literal("newest"), v.literal("featured"), v.literal("default")),
    onlyInStock: v.boolean(),
    visibleCount: v.number(),
    productIds: v.array(v.id("products")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const brands = await ctx.db.query("brands").collect();
    const maxOrder = brands.reduce((m, b) => Math.max(m, b.order), -1);
    await ctx.db.insert("brands", {
      name: args.name,
      logo: args.logo,
      mode: args.mode,
      matchBrand: args.matchBrand,
      matchCategory: args.matchCategory,
      sortBy: args.sortBy,
      onlyInStock: args.onlyInStock,
      visibleCount: args.visibleCount,
      productIds: args.productIds,
      order: maxOrder + 1,
      hidden: false,
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("brands"),
    name: v.string(),
    logo: v.string(),
    mode: v.union(v.literal("auto"), v.literal("manual")),
    matchBrand: v.optional(v.string()),
    matchCategory: v.optional(v.union(v.literal("gaming"), v.literal("refurbished"))),
    sortBy: v.union(v.literal("newest"), v.literal("featured"), v.literal("default")),
    onlyInStock: v.boolean(),
    visibleCount: v.number(),
    productIds: v.array(v.id("products")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.patch(args.id, {
      name: args.name,
      logo: args.logo,
      mode: args.mode,
      matchBrand: args.matchBrand,
      matchCategory: args.matchCategory,
      sortBy: args.sortBy,
      onlyInStock: args.onlyInStock,
      visibleCount: args.visibleCount,
      productIds: args.productIds,
    });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("brands") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const toggleHidden = mutation({
  args: { token: v.string(), id: v.id("brands") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const brand = await ctx.db.get(id);
    if (!brand) return;
    await ctx.db.patch(id, { hidden: !brand.hidden });
  },
});

export const move = mutation({
  args: { token: v.string(), id: v.id("brands"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const brands = (await ctx.db.query("brands").collect()).sort((a, b) => a.order - b.order);
    const index = brands.findIndex((b) => b._id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= brands.length) return;
    const a = brands[index];
    const b = brands[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
