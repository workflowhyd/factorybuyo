import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const badges = await ctx.db.query("trustBadges").collect();
    return badges.sort((a, b) => a.order - b.order);
  },
});

export const add = mutation({
  args: {
    token: v.string(),
    icon: v.string(),
    title: v.string(),
    desc: v.string(),
    href: v.optional(v.string()),
  },
  handler: async (ctx, { token, icon, title, desc, href }) => {
    await requireAdmin(ctx, token);
    const badges = await ctx.db.query("trustBadges").collect();
    const maxOrder = badges.reduce((m, b) => Math.max(m, b.order), -1);
    await ctx.db.insert("trustBadges", {
      icon,
      title,
      desc,
      href,
      order: maxOrder + 1,
      hidden: false,
    });
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("trustBadges"),
    icon: v.string(),
    title: v.string(),
    desc: v.string(),
    href: v.optional(v.string()),
  },
  handler: async (ctx, { token, id, icon, title, desc, href }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { icon, title, desc, href });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("trustBadges") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const toggleHidden = mutation({
  args: { token: v.string(), id: v.id("trustBadges") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const badge = await ctx.db.get(id);
    if (!badge) return;
    await ctx.db.patch(id, { hidden: !badge.hidden });
  },
});

export const move = mutation({
  args: { token: v.string(), id: v.id("trustBadges"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const badges = (await ctx.db.query("trustBadges").collect()).sort((a, b) => a.order - b.order);
    const index = badges.findIndex((b) => b._id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= badges.length) return;
    const a = badges[index];
    const b = badges[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
