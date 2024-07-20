// import { internalMutation, internalQuery } from '../_generated/server';

// export const fetchMessages = internalQuery(async ({ db }) => {
//   return await db.query('message').order('desc').take(100);
// });

import { query } from '../_generated/server';
import { v } from "convex/values";

export const fetchAll = query({
  args: {}, 
  handler: async (ctx) => { // fetch all messages documents
    const allMsgs = await ctx.db.query("message").collect();
    const transformedMsgs = allMsgs.map(msg => ({ // transform the documents to include only the desired fields
      msg: msg.msg,
    }));

    return transformedMsgs; 
  },
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