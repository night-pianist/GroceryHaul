// import { internalMutation, internalQuery } from '../_generated/server';

// export const fetchMessages = internalQuery(async ({ db }) => {
//   return await db.query('message').order('desc').take(100);
// });

import { mutation, query } from '../_generated/server';
import { v } from "convex/values";

export const fetchAll = query({
  args: {}, 
  handler: async (ctx, args) => {
    // Fetch all messages from the 'message' table
    const messages = await ctx.db.table('message').find().toArray();
    return messages;
  }
});




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