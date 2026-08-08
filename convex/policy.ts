import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

const slugValidator = v.union(
  v.literal("privacy-policy"),
  v.literal("terms-and-conditions"),
  v.literal("cancellation-policy")
);

export const getPage = query({
  args: { slug: slugValidator },
  handler: async (ctx, { slug }) => {
    const page = await ctx.db
      .query("policyPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    const sections = (
      await ctx.db
        .query("policySections")
        .withIndex("by_page", (q) => q.eq("pageSlug", slug))
        .collect()
    ).sort((a, b) => a.order - b.order);
    return { page, sections };
  },
});

export const updatePageMeta = mutation({
  args: {
    token: v.string(),
    slug: slugValidator,
    title: v.string(),
    intro: v.optional(v.string()),
    lastUpdated: v.string(),
  },
  handler: async (ctx, { token, slug, title, intro, lastUpdated }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db
      .query("policyPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { title, intro, lastUpdated });
    } else {
      await ctx.db.insert("policyPages", { slug, title, intro, lastUpdated });
    }
  },
});

export const addSection = mutation({
  args: { token: v.string(), pageSlug: v.string(), heading: v.string(), body: v.string() },
  handler: async (ctx, { token, pageSlug, heading, body }) => {
    await requireAdmin(ctx, token);
    const sections = await ctx.db
      .query("policySections")
      .withIndex("by_page", (q) => q.eq("pageSlug", pageSlug))
      .collect();
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.order), -1);
    await ctx.db.insert("policySections", { pageSlug, heading, body, order: maxOrder + 1 });
  },
});

export const updateSection = mutation({
  args: { token: v.string(), id: v.id("policySections"), heading: v.string(), body: v.string() },
  handler: async (ctx, { token, id, heading, body }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { heading, body });
  },
});

export const removeSection = mutation({
  args: { token: v.string(), id: v.id("policySections") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const moveSection = mutation({
  args: {
    token: v.string(),
    id: v.id("policySections"),
    pageSlug: v.string(),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, { token, id, pageSlug, direction }) => {
    await requireAdmin(ctx, token);
    const sections = (
      await ctx.db
        .query("policySections")
        .withIndex("by_page", (q) => q.eq("pageSlug", pageSlug))
        .collect()
    ).sort((a, b) => a.order - b.order);
    const index = sections.findIndex((s) => s._id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sections.length) return;
    const a = sections[index];
    const b = sections[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
