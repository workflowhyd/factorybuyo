import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error("Admin password is not configured on the server.");
    }
    if (password !== adminPassword) {
      throw new Error("Incorrect password.");
    }
    const token = crypto.randomUUID();
    await ctx.db.insert("sessions", {
      token,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    return token;
  },
});

export async function requireAdmin(ctx: MutationCtx, token: string | undefined) {
  if (!token) {
    throw new Error("Not authenticated.");
  }
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .unique();
  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Session expired. Please log in again.");
  }
}
