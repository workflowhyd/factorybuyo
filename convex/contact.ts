import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactInfo").first();
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    email: v.string(),
    marketsNote: v.string(),
    phone: v.optional(v.string()),
    hours: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, { token, email, marketsNote, phone, hours, address }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("contactInfo").first();
    const data = { email, marketsNote, phone, hours, address };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("contactInfo", data);
    }
  },
});
