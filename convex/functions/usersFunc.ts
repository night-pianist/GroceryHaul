import { internalMutation/*, query, QueryCtx */} from "../_generated/server";
// import { UserJSON } from "@clerk/backend";
import { v/*, Validator */} from "convex/values";

export const createUser = internalMutation({
    args: { userName: v.string(), clerkId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        console.log("TOKEN IDENTIFIER:", JSON.stringify(identity.tokenIdentifier));

        const user = await ctx.db.insert("users", {
            userName: args.userName,
            clerkId: args.clerkId,
            // token_identifier: identity.tokenIdentifier,
            chatHistory: [], // initialize empty chat history for new users
        });
        return user;
    }
})