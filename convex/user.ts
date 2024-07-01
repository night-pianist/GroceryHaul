import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// GET CURRENT USER
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

// GET A USER'S DATA
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
});

export const update = internalMutation({
    args: {
        userId: v.string(),
        email: v.string(),
        fullName: v.string(), 
    },
    handler: async (ctx, args) => {
        const existingDoc = await ctx.db.query("user")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        if (!existingDoc) {
            throw new Error("User Not Found");
        }

        const document = await ctx.db.patch(existingDoc._id, args);

        return document; 
    }
});

export const remove = internalMutation({
    args: { userId: v.string() }, 
    handler: async (ctx, args) => {
        const existingDocument = await ctx.db.query("user")
            .filter(q => q.eq(q.field("userId"), args.userId))
            .first();

        if (!existingDocument) {
            throw new Error("User Not Found");
        }
        await ctx.db.delete(existingDocument._id);
    }
});
