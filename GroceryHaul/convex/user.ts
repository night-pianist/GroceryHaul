import { internalMutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { useQuery } from "convex/react";
import { v, Validator } from "convex/values";


export const createUser = internalMutation({
    args: { userId: v.string(), userName: v.string(), clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db.insert("user", {
            userId: args.userId,
            userName: args.userName,
            clerkId: args.clerkId,
        });
        return user;
    }
});

// export const removeUser = internalMutation({
//     args: { clerkUserId: v.string() },
//     async handler(ctx, { clerkUserId }) {
//       const user = await userByClerkUserId(ctx, clerkUserId);
  
//       if (user !== null) {
//         await ctx.db.delete(user._id);
//       } else {
//         console.warn(
//           `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
//         );
//       }
//     },
//   });

// export const userByClerkUserId = useQuery({
//     args: { userId: v.string(), userName: v.string(), clerkId: v.string() },
//     handler: async (ctx, args) => {
//         const user = await ctx.db.insert("user", {
//             userId: args.userId,
//             userName: args.userName,
//             clerkId: args.clerkId,
//         });
//         return user;
//     }
// })
