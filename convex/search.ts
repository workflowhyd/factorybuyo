import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("searchSettings").first();
  },
});

export const updateSettings = mutation({
  args: { token: v.string(), displayLimit: v.number() },
  handler: async (ctx, { token, displayLimit }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("searchSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, { displayLimit });
    } else {
      await ctx.db.insert("searchSettings", { displayLimit });
    }
  },
});

export const listPopular = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("popularSearches").collect();
    return items.sort((a, b) => a.order - b.order);
  },
});

export const addPopular = mutation({
  args: { token: v.string(), label: v.string(), query: v.string() },
  handler: async (ctx, { token, label, query }) => {
    await requireAdmin(ctx, token);
    const items = await ctx.db.query("popularSearches").collect();
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order), -1);
    await ctx.db.insert("popularSearches", { label, query, order: maxOrder + 1 });
  },
});

export const removePopular = mutation({
  args: { token: v.string(), id: v.id("popularSearches") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const listSynonyms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("searchSynonyms").collect();
  },
});

export const addSynonym = mutation({
  args: { token: v.string(), term: v.string(), synonym: v.string() },
  handler: async (ctx, { token, term, synonym }) => {
    await requireAdmin(ctx, token);
    await ctx.db.insert("searchSynonyms", {
      term: term.trim().toLowerCase(),
      synonym: synonym.trim().toLowerCase(),
    });
  },
});

export const removeSynonym = mutation({
  args: { token: v.string(), id: v.id("searchSynonyms") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

async function expandQuery(ctx: QueryCtx, raw: string) {
  const synonyms = await ctx.db.query("searchSynonyms").collect();
  const words = raw.toLowerCase().split(/\s+/).filter(Boolean);
  const extra: string[] = [];
  for (const w of words) {
    for (const s of synonyms) {
      if (s.term === w) extra.push(s.synonym);
      if (s.synonym === w) extra.push(s.term);
    }
  }
  return [...words, ...extra].join(" ");
}

export const predictive = query({
  args: { query: v.string() },
  handler: async (ctx, { query: rawQuery }) => {
    const q = rawQuery.trim();
    if (!q) return { products: [], brands: [], categories: [] };

    const expanded = await expandQuery(ctx, q);
    const settings = await ctx.db.query("searchSettings").first();
    const limit = settings?.displayLimit ?? 6;

    const products = await ctx.db
      .query("products")
      .withSearchIndex("search_text", (s) => s.search("searchText", expanded))
      .take(limit);

    const lower = q.toLowerCase();
    const allProducts = await ctx.db.query("products").collect();
    const brands = Array.from(
      new Set(
        allProducts.map((p) => p.brand).filter((b) => b.toLowerCase().includes(lower))
      )
    ).slice(0, 5);

    const categoryLabels: { value: "gaming" | "refurbished"; label: string }[] = [
      { value: "gaming", label: "Gaming Laptops" },
      { value: "refurbished", label: "Pre-Owned Laptops" },
    ];
    const categories = categoryLabels.filter((c) => c.label.toLowerCase().includes(lower));

    return { products, brands, categories };
  },
});

export const fullSearch = query({
  args: { query: v.string() },
  handler: async (ctx, { query: rawQuery }) => {
    const q = rawQuery.trim();
    if (!q) return [];
    const expanded = await expandQuery(ctx, q);
    return await ctx.db
      .query("products")
      .withSearchIndex("search_text", (s) => s.search("searchText", expanded))
      .collect();
  },
});
