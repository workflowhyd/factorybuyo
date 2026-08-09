import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";
import type { Doc } from "./_generated/dataModel";

const categoryValidator = v.union(v.literal("gaming"), v.literal("refurbished"));
const sortValidator = v.union(
  v.literal("bestMatch"),
  v.literal("priceLowHigh"),
  v.literal("priceHighLow"),
  v.literal("newest"),
  v.literal("oldest")
);

export const listDefs = query({
  args: { category: categoryValidator },
  handler: async (ctx, { category }) => {
    const defs = await ctx.db
      .query("filterDefs")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();
    return defs.sort((a, b) => a.order - b.order);
  },
});

export const addDef = mutation({
  args: {
    token: v.string(),
    category: categoryValidator,
    key: v.union(
      v.literal("brand"),
      v.literal("price"),
      v.literal("cpu"),
      v.literal("gpu"),
      v.literal("ram"),
      v.literal("storage"),
      v.literal("display"),
      v.literal("conditionGrade"),
      v.literal("inStock")
    ),
    label: v.string(),
  },
  handler: async (ctx, { token, category, key, label }) => {
    await requireAdmin(ctx, token);
    const defs = await ctx.db
      .query("filterDefs")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();
    if (defs.some((d) => d.key === key)) {
      throw new Error("That filter is already added for this category.");
    }
    const maxOrder = defs.reduce((m, d) => Math.max(m, d.order), -1);
    await ctx.db.insert("filterDefs", { category, key, label, order: maxOrder + 1, enabled: true });
  },
});

export const updateDef = mutation({
  args: { token: v.string(), id: v.id("filterDefs"), label: v.string() },
  handler: async (ctx, { token, id, label }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { label });
  },
});

export const removeDef = mutation({
  args: { token: v.string(), id: v.id("filterDefs") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const toggleDefEnabled = mutation({
  args: { token: v.string(), id: v.id("filterDefs") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const def = await ctx.db.get(id);
    if (!def) return;
    await ctx.db.patch(id, { enabled: !def.enabled });
  },
});

export const moveDef = mutation({
  args: { token: v.string(), id: v.id("filterDefs"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const def = await ctx.db.get(id);
    if (!def) return;
    const siblings = (
      await ctx.db
        .query("filterDefs")
        .withIndex("by_category", (q) => q.eq("category", def.category))
        .collect()
    ).sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((d) => d._id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= siblings.length) return;
    const a = siblings[index];
    const b = siblings[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});

/** Distinct filter values actually present in the current catalogue, so the
 * UI never offers a value with zero matching products. */
export const getFacets = query({
  args: { category: v.optional(categoryValidator) },
  handler: async (ctx, { category }) => {
    const products = category
      ? await ctx.db
          .query("products")
          .withIndex("by_category", (q) => q.eq("category", category))
          .collect()
      : await ctx.db.query("products").collect();

    const set = (values: (string | undefined)[]) =>
      Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();

    const prices = products.map((p) => p.price);
    return {
      brands: set(products.map((p) => p.brand)),
      cpus: set(products.map((p) => p.specs.cpu)),
      gpus: set(products.map((p) => p.specs.gpu)),
      rams: set(products.map((p) => p.specs.ram)),
      storages: set(products.map((p) => p.specs.storage)),
      displays: set(products.map((p) => p.specs.display)),
      conditions: set(products.map((p) => p.conditionGrade)),
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
    };
  },
});

function sortProducts(
  products: Doc<"products">[],
  sort: string | undefined,
  relevanceOrder?: Doc<"products">["_id"][]
) {
  const sorted = products.slice();
  if (sort === "bestMatch" || !sort) {
    if (relevanceOrder) {
      // Preserve the order the search index returned — that *is* "best match".
      const rank = new Map(relevanceOrder.map((id, i) => [id, i]));
      return sorted.sort((a, b) => (rank.get(a._id) ?? 999) - (rank.get(b._id) ?? 999));
    }
    // No search context: our own curation — featured first, then newest.
    return sorted.sort(
      (a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt
    );
  }
  switch (sort) {
    case "priceLowHigh":
      return sorted.sort((a, b) => a.price - b.price);
    case "priceHighLow":
      return sorted.sort((a, b) => b.price - a.price);
    case "oldest":
      return sorted.sort((a, b) => a.createdAt - b.createdAt);
    case "newest":
    default:
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const listFiltered = query({
  args: {
    category: v.optional(categoryValidator),
    productIds: v.optional(v.array(v.id("products"))),
    brand: v.optional(v.array(v.string())),
    cpu: v.optional(v.array(v.string())),
    gpu: v.optional(v.array(v.string())),
    ram: v.optional(v.array(v.string())),
    storage: v.optional(v.array(v.string())),
    display: v.optional(v.array(v.string())),
    conditionGrade: v.optional(v.array(v.string())),
    inStockOnly: v.optional(v.boolean()),
    priceMin: v.optional(v.number()),
    priceMax: v.optional(v.number()),
    sort: v.optional(sortValidator),
  },
  handler: async (ctx, args) => {
    let products: Doc<"products">[];
    if (args.productIds) {
      const fetched = await Promise.all(args.productIds.map((id) => ctx.db.get(id)));
      products = fetched.filter((p): p is Doc<"products"> => p !== null);
    } else if (args.category) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }

    if (args.brand?.length) products = products.filter((p) => args.brand!.includes(p.brand));
    if (args.cpu?.length) products = products.filter((p) => p.specs.cpu && args.cpu!.includes(p.specs.cpu));
    if (args.gpu?.length) products = products.filter((p) => p.specs.gpu && args.gpu!.includes(p.specs.gpu));
    if (args.ram?.length) products = products.filter((p) => p.specs.ram && args.ram!.includes(p.specs.ram));
    if (args.storage?.length)
      products = products.filter((p) => p.specs.storage && args.storage!.includes(p.specs.storage));
    if (args.display?.length)
      products = products.filter((p) => p.specs.display && args.display!.includes(p.specs.display));
    if (args.conditionGrade?.length)
      products = products.filter((p) => p.conditionGrade && args.conditionGrade!.includes(p.conditionGrade));
    if (args.inStockOnly) products = products.filter((p) => p.inStock);
    if (args.priceMin !== undefined) products = products.filter((p) => p.price >= args.priceMin!);
    if (args.priceMax !== undefined) products = products.filter((p) => p.price <= args.priceMax!);

    return sortProducts(products, args.sort, args.productIds);
  },
});
