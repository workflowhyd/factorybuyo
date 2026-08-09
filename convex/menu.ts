import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

export const getMenu = query({
  args: {},
  handler: async (ctx) => {
    const items = (await ctx.db.query("menuItems").collect()).sort((a, b) => a.order - b.order);
    const allSubitems = (await ctx.db.query("menuSubitems").collect()).sort(
      (a, b) => a.order - b.order
    );
    const categories = items
      .filter((i) => i.kind === "category")
      .map((cat) => ({
        ...cat,
        subitems: allSubitems.filter((s) => s.parentId === cat._id),
      }));
    const info = items.filter((i) => i.kind === "info");
    return { categories, info };
  },
});

export const addItem = mutation({
  args: {
    token: v.string(),
    kind: v.union(v.literal("category"), v.literal("info")),
    label: v.string(),
    href: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, { token, kind, label, href, icon }) => {
    await requireAdmin(ctx, token);
    const items = await ctx.db.query("menuItems").collect();
    const maxOrder = items.filter((i) => i.kind === kind).reduce((m, i) => Math.max(m, i.order), -1);
    await ctx.db.insert("menuItems", { kind, label, href, icon, order: maxOrder + 1, hidden: false });
  },
});

export const updateItem = mutation({
  args: {
    token: v.string(),
    id: v.id("menuItems"),
    label: v.string(),
    href: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, { token, id, label, href, icon }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { label, href, icon });
  },
});

export const removeItem = mutation({
  args: { token: v.string(), id: v.id("menuItems") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const subitems = await ctx.db
      .query("menuSubitems")
      .withIndex("by_parent", (q) => q.eq("parentId", id))
      .collect();
    for (const s of subitems) {
      await ctx.db.delete(s._id);
    }
    await ctx.db.delete(id);
  },
});

export const toggleItemHidden = mutation({
  args: { token: v.string(), id: v.id("menuItems") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const item = await ctx.db.get(id);
    if (!item) return;
    await ctx.db.patch(id, { hidden: !item.hidden });
  },
});

export const moveItem = mutation({
  args: { token: v.string(), id: v.id("menuItems"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { token, id, direction }) => {
    await requireAdmin(ctx, token);
    const item = await ctx.db.get(id);
    if (!item) return;
    const siblings = (await ctx.db.query("menuItems").collect())
      .filter((i) => i.kind === item.kind)
      .sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((i) => i._id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= siblings.length) return;
    const a = siblings[index];
    const b = siblings[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});

export const addSubitem = mutation({
  args: { token: v.string(), parentId: v.id("menuItems"), label: v.string(), href: v.string() },
  handler: async (ctx, { token, parentId, label, href }) => {
    await requireAdmin(ctx, token);
    const subitems = await ctx.db
      .query("menuSubitems")
      .withIndex("by_parent", (q) => q.eq("parentId", parentId))
      .collect();
    const maxOrder = subitems.reduce((m, s) => Math.max(m, s.order), -1);
    await ctx.db.insert("menuSubitems", { parentId, label, href, order: maxOrder + 1 });
  },
});

export const updateSubitem = mutation({
  args: { token: v.string(), id: v.id("menuSubitems"), label: v.string(), href: v.string() },
  handler: async (ctx, { token, id, label, href }) => {
    await requireAdmin(ctx, token);
    await ctx.db.patch(id, { label, href });
  },
});

export const removeSubitem = mutation({
  args: { token: v.string(), id: v.id("menuSubitems") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});

export const moveSubitem = mutation({
  args: {
    token: v.string(),
    id: v.id("menuSubitems"),
    parentId: v.id("menuItems"),
    direction: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, { token, id, parentId, direction }) => {
    await requireAdmin(ctx, token);
    const subitems = (
      await ctx.db
        .query("menuSubitems")
        .withIndex("by_parent", (q) => q.eq("parentId", parentId))
        .collect()
    ).sort((a, b) => a.order - b.order);
    const index = subitems.findIndex((s) => s._id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= subitems.length) return;
    const a = subitems[index];
    const b = subitems[swapIndex];
    await ctx.db.patch(a._id, { order: b.order });
    await ctx.db.patch(b._id, { order: a.order });
  },
});
