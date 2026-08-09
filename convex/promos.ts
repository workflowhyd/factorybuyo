import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

const categoryValidator = v.union(v.literal("gaming"), v.literal("refurbished"));

/** Only currently-active, enabled promos for a category — respects scheduling. */
export const listActive = query({
  args: { category: categoryValidator },
  handler: async (ctx, { category }) => {
    const promos = await ctx.db
      .query("categoryPromos")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();
    const now = Date.now();
    return promos
      .filter((p) => p.enabled)
      .filter((p) => !p.startsAt || p.startsAt <= now)
      .filter((p) => !p.endsAt || p.endsAt >= now)
      .sort((a, b) => a.order - b.order);
  },
});

/** Everything for a category, including disabled/scheduled — for the admin list. */
export const listAll = query({
  args: { category: categoryValidator },
  handler: async (ctx, { category }) => {
    const promos = await ctx.db
      .query("categoryPromos")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();
    return promos.sort((a, b) => a.order - b.order);
  },
});

export const add = mutation({
  args: {
    token: v.string(),
    category: categoryValidator,
    image: v.string(),
    headline: v.string(),
    sub: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaHref: v.optional(v.string()),
    startsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const existing = await ctx.db
      .query("categoryPromos")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    const maxOrder = existing.reduce((m, p) => Math.max(m, p.order), -1);
    await ctx.db.insert("categoryPromos", {
      category: args.category,
      image: args.image,
      headline: args.headline,
      sub: args.sub,
      ctaText: args.ctaText,
      ctaHref: args.ctaHref,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      order: maxOrder + 1,
      enabled: true,
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("categoryPromos"),
    image: v.string(),
    headline: v.string(),
    sub: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaHref: v.optional(v.string()),
    startsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    await ctx.db.patch(args.id, {
      image: args.image,
      headline: args.headline,
      sub: args.sub,
      ctaText: args.ctaText,
      ctaHref: args.ctaHref,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
    });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("categoryPromos") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const toggleEnabled = mutation({
  args: { token: v.string(), id: v.id("categoryPromos") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const promo = await ctx.db.get(id);
    if (!promo) return;
    await ctx.db.patch(id, { enabled: !promo.enabled });
  },
});

export const move = mutation({
  args: { token: v.string(), id: v.id("categoryPromos"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const promo = await ctx.db.get(id);
    if (!promo) return;
    const siblings = (
      await ctx.db
        .query("categoryPromos")
        .withIndex("by_category", (q) => q.eq("category", promo.category))
        .collect()
    ).sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((p) => p._id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= siblings.length) return;
    const a = siblings[index];
    const b = siblings[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
