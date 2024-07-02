import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// // ADD MSG TO CHAT HISTORY
// export const addMessage = internalMutation({
//     args: {
//         messageId: v.string(),
//         userId: v.string(),
//         timestamp: v.number(),
//         message: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const message = await ctx.db.insert("chatHistory", args);
//         return message;
//     }
// });

// // GET ALL MSG FOR A SPECIFIC USER 
// export const getMessagesByUserId = internalQuery({
//     args: { userId: v.string() },
//     handler: async (ctx, args) => {
//         const messages = await ctx.db.query('chatHistory')
//             .withIndex('byUserId', (q) => q.eq("userId", args.userId))
//             // .all();
//         return messages;
//     }
// });