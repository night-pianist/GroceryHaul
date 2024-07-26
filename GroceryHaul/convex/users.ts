import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const createUser = mutation({
    args: {
        userName: v.string()
    },
    handler: async (context, args) => {
      const document = await context.db.insert("user", // insert document into message collection in the database
      {
        userName: args.userName,
      });
      
      return document; 
    }
  })

// export const createUser = mutation({
    
//     args: { userName: v.string() },
//     handler: async (ctx, args) => {
//         const user = await ctx.db.insert("user", {
//             // userId: args.userid,
//             userName: args.userName,
//         });
//         return user;
//     }
// });
