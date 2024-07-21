import { mutation } from '../_generated/server';
import { v } from "convex/values";

export const saveMessage = mutation({
  args: {
    msg: v.string(),
    userId: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (context, args) => {
    const document = await context.db.insert("message", // insert document into message collection in the database
    {
      msg: args.msg,
      userId: args.userId ?? '',
      type: args.type, 
    });
    
    return document; 
  }
})


// export const saveMessage = mutation({
//   args: {
//     userId: v.string(),
//     msg: v.string(),
//     chatHistory: v.optional(v.any()) // stores all messages
//     msg: v.string(),
//     userId: v.optional(v.string()),
//     type: v.string(),
//   },
//   handler: async (context, args) => {
//     const document = await context.db.insert("message", // insert document into message collection in the database
//     {
//       msg: args.msg,
//       userId: args.userId ?? '',
//       type: args.type, 
//     });
    
//     return document; 
//   }
// })

