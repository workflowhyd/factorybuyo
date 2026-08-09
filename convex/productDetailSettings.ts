import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("productDetailSettings").first();
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    showHighlights: v.boolean(),
    showSpecs: v.boolean(),
    showCondition: v.boolean(),
    showIncluded: v.boolean(),
    showWarranty: v.boolean(),
    showReviews: v.boolean(),
    showQA: v.boolean(),
    showCompare: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const existing = await ctx.db.query("productDetailSettings").first();
    const data = {
      showHighlights: args.showHighlights,
      showSpecs: args.showSpecs,
      showCondition: args.showCondition,
      showIncluded: args.showIncluded,
      showWarranty: args.showWarranty,
      showReviews: args.showReviews,
      showQA: args.showQA,
      showCompare: args.showCompare,
    };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("productDetailSettings", data);
    }
  },
});
