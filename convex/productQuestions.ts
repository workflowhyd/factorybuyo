import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

/** Published questions for a single product — used on the product page. */
export const listPublished = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const questions = await ctx.db
      .query("productQuestions")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .collect();
    return questions
      .filter((q) => q.status === "published")
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Every question across every product, newest first — used in the admin moderation queue. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("productQuestions").collect();
    return questions.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const submit = mutation({
  args: { productId: v.id("products"), name: v.string(), question: v.string() },
  handler: async (ctx, { productId, name, question }) => {
    await ctx.db.insert("productQuestions", {
      productId,
      name,
      question,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const answer = mutation({
  args: { token: v.string(), id: v.id("productQuestions"), answer: v.string() },
  handler: async (ctx, { token, id, answer }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { answer, status: "published" });
  },
});

export const setStatus = mutation({
  args: {
    token: v.string(),
    id: v.id("productQuestions"),
    status: v.union(v.literal("pending"), v.literal("published"), v.literal("hidden")),
  },
  handler: async (ctx, { token, id, status }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { status });
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("productQuestions") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
