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

export const add = mutation({
  args: {
    token: v.string(),
    slug: v.string(),
    name: v.string(),
    category: v.union(v.literal("gaming"), v.literal("refurbished")),
    brand: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    specs: specsValidator,
    conditionGrade: conditionValidator,
    images: v.array(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
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
      specs: args.specs,
      conditionGrade: args.conditionGrade,
      images: args.images,
      featured: args.featured,
      inStock: args.inStock,
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
    specs: specsValidator,
    conditionGrade: conditionValidator,
    images: v.array(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
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
      specs: args.specs,
      conditionGrade: args.conditionGrade,
      images: args.images,
      featured: args.featured,
      inStock: args.inStock,
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
