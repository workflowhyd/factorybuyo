import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const faqs = await ctx.db.query("faqs").collect();
    return faqs.sort((a, b) => a.order - b.order);
  },
});

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqSettings").first();
  },
});

export const updateSettings = mutation({
  args: {
    token: v.string(),
    heading: v.string(),
    intro: v.optional(v.string()),
    defaultOpenId: v.optional(v.id("faqs")),
    ctaEnabled: v.boolean(),
    ctaText: v.string(),
  },
  handler: async (ctx, { token, heading, intro, defaultOpenId, ctaEnabled, ctaText }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("faqSettings").first();
    const data = { heading, intro, defaultOpenId, ctaEnabled, ctaText };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("faqSettings", data);
    }
  },
});

export const add = mutation({
  args: { token: v.string(), question: v.string(), answer: v.string() },
  handler: async (ctx, { token, question, answer }) => {
    await requireAdmin(ctx, token);
    const faqs = await ctx.db.query("faqs").collect();
    const maxOrder = faqs.reduce((m, f) => Math.max(m, f.order), -1);
    await ctx.db.insert("faqs", { question, answer, order: maxOrder + 1, hidden: false });
  },
});

export const update = mutation({
  args: { token: v.string(), id: v.id("faqs"), question: v.string(), answer: v.string() },
  handler: async (ctx, { token, id, question, answer }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { question, answer });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("faqs") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
    const settings = await ctx.db.query("faqSettings").first();
    if (settings?.defaultOpenId === id) {
      await ctx.db.patch(settings._id, { defaultOpenId: undefined });
    }
  },
});

export const toggleHidden = mutation({
  args: { token: v.string(), id: v.id("faqs") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const faq = await ctx.db.get(id);
    if (!faq) return;
    await ctx.db.patch(id, { hidden: !faq.hidden });
  },
});

export const move = mutation({
  args: { token: v.string(), id: v.id("faqs"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const faqs = (await ctx.db.query("faqs").collect()).sort((a, b) => a.order - b.order);
    const index = faqs.findIndex((f) => f._id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= faqs.length) return;
    const a = faqs[index];
    const b = faqs[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
