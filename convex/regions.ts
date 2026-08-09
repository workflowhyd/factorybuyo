import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("regionSettings").collect();
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    code: v.union(v.literal("IN"), v.literal("SG")),
    label: v.string(),
    flag: v.string(),
    whatsappNumber: v.optional(v.string()),
    bannerText: v.string(),
    deliveryNote: v.optional(v.string()),
    marketNotice: v.optional(v.string()),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const existing = await ctx.db
      .query("regionSettings")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();
    const data = {
      code: args.code,
      label: args.label,
      flag: args.flag,
      whatsappNumber: args.whatsappNumber,
      bannerText: args.bannerText,
      deliveryNote: args.deliveryNote,
      marketNotice: args.marketNotice,
      enabled: args.enabled,
    };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("regionSettings", data);
    }
  },
});
