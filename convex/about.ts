import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const getHero = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aboutHero").first();
  },
});

export const updateHero = mutation({
  args: { token: v.string(), eyebrow: v.string(), title: v.string(), subtitle: v.string() },
  handler: async (ctx, { token, eyebrow, title, subtitle }) => {
    await requireAdmin(ctx, token);
    const existing = await ctx.db.query("aboutHero").first();
    if (existing) {
      await ctx.db.patch(existing._id, { eyebrow, title, subtitle });
    } else {
      await ctx.db.insert("aboutHero", { eyebrow, title, subtitle });
    }
  },
});

export const listPanels = query({
  args: {},
  handler: async (ctx) => {
    const panels = await ctx.db.query("aboutPanels").collect();
    return panels.sort((a, b) => a.order - b.order);
  },
});

export const addPanel = mutation({
  args: { token: v.string(), title: v.string(), body: v.string() },
  handler: async (ctx, { token, title, body }) => {
    await requireAdmin(ctx, token);
    const panels = await ctx.db.query("aboutPanels").collect();
    const maxOrder = panels.reduce((m, p) => Math.max(m, p.order), -1);
    await ctx.db.insert("aboutPanels", { title, body, order: maxOrder + 1, hidden: false });
  },
});

export const updatePanel = mutation({
  args: { token: v.string(), id: v.id("aboutPanels"), title: v.string(), body: v.string() },
  handler: async (ctx, { token, id, title, body }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { title, body });
  },
});

export const removePanel = mutation({
  args: { token: v.string(), id: v.id("aboutPanels") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const togglePanelHidden = mutation({
  args: { token: v.string(), id: v.id("aboutPanels") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const panel = await ctx.db.get(id);
    if (!panel) return;
    await ctx.db.patch(id, { hidden: !panel.hidden });
  },
});

export const movePanel = mutation({
  args: { token: v.string(), id: v.id("aboutPanels"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const panels = (await ctx.db.query("aboutPanels").collect()).sort((a, b) => a.order - b.order);
    const index = panels.findIndex((p) => p._id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= panels.length) return;
    const a = panels[index];
    const b = panels[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
