import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const MAX_TESTIMONIALS = 10;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const testimonials = await ctx.db.query("testimonials").collect();
    return testimonials.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const add = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    quote: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, { token, name, quote, rating }) => {
    await requireAdmin(ctx, token);
    const count = (await ctx.db.query("testimonials").collect()).length;
    if (count >= MAX_TESTIMONIALS) {
      throw new Error(
        `Testimonial limit reached (${MAX_TESTIMONIALS} max). Delete one before adding a new one.`
      );
    }
    await ctx.db.insert("testimonials", {
      name,
      quote,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("testimonials") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
