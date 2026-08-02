import { internalMutation } from "./_generated/server";
import { seedProducts } from "./seedData";

// Run once after deploying: npx convex run seed:seedProducts
export const seedProductsMutation = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) {
      return "Products already exist, skipping seed.";
    }
    for (const product of seedProducts) {
      await ctx.db.insert("products", { ...product, createdAt: Date.now() });
    }
    return `Seeded ${seedProducts.length} products.`;
  },
});
