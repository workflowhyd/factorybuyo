import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = mutation({
  args: { token: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, { token, storageId }) => {
    await requireAdmin(ctx, token);
    return await ctx.storage.getUrl(storageId);
  },
});
