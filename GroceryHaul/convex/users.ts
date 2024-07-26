import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
    args: {}, 
    handler: async (ctx, args) => {
        const userId = await ctx.auth.getUserIdentity();
        if (!userId) {
            throw new Error('Not Authenticated');
        }
        const user = await ctx.db.query('user')
            .withIndex('byUserId', (q) => q.eq("userId", userId.subject))
            .first();

        return user; 
    }
});

export const createUser = internalMutation({
    args: { userid: v.string(), email: v.string(), fullName: v.string(), pfpUrl: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("user", {
            userId: args.userid,
            email: args.email,
            fullName: args.fullName,
            pfpUrl: args.pfpUrl,
        });
        return user;
    }
});

export const getUserData = internalQuery({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('user')
            .withIndex('byUserId', (q) => q.eq("userId", args.userId))
            .first();
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
})