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



// export const saveMessage = mutation(async ({ db }, { msg, userId, type }) => {
//   await db.insert('message', { msg, userId, type });
// });

// import { internalMutation } from '../_generated/server';
// import { Message } from './types';

// export const saveMessage = internalMutation(async ({ db }, message: Message) => {
//     const { msg, userId, type } = message;
//     await db.insert('message', { msg, userId, type });
// });

// 76 is how u write the function, 258 is how it’s used, 58 is how you initialize it in a file