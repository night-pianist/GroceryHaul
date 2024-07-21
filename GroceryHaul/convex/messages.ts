import { query } from "./_generated/server";

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("message") // Ensure this matches your collection name
      .filter((q) => q.eq(q.field("userId"), identity.email)) // Adjust field names if necessary
      .collect();
  },
});