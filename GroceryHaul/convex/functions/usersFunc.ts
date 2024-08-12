import { internalMutation, query, QueryCtx } from "../_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

export const createUser = internalMutation({
    args: { userName: v.string(), clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("users", {
            userName: args.userName,
            clerkId: args.clerkId,
            chatHistory: [], // initialize empty chat history for new users
        });
        return user;
    }
});

export const updateUser = internalMutation({
    args: { userName: v.string(), clerkId: v.string(), chatHistory: v.any() },
    handler: async (ctx, args) => {
        let existingDoc = await ctx.db.query("users")
        .filter(q => q.eq(q.field("clerkId"), args.clerkId))
        .first();

        const { clerkId, ...rest } = args;

        if (!existingDoc) { 
            const newId = await createUser(ctx, {
                userName: rest.userName,
                clerkId: clerkId,
            })
            existingDoc = await ctx.db.query("users")
            .filter(q => q.eq(q.field("_id"), newId))
            .first();
         }

         if(!existingDoc) { throw new Error("User Not Found"); }

        const document = await ctx.db.patch(existingDoc._id, {...rest})

        return document; 
    }
});