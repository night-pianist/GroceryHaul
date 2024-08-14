import { mutation } from '../_generated/server';
// import { useMutation, useQuery } from 'convex/react';
// import { api } from "../_generated/api";
import { v } from "convex/values";

export const saveMessage2 = mutation({
  args: {
    msg: v.string(),
    type: v.string(),
  },
  handler: async (context, args) => {
    const identity = await context.auth.getUserIdentity();
    console.log("IDENTITY IS: ", JSON.stringify(identity));

    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await context.db.query('users')
      .withIndex('byClerkId', (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }

    // create the new message object
    const newMessage = {
      type: args.type,
      text: args.msg,
    };

    console.log("TYPE: ", args.type);
    console.log("TEXT: ", args.msg);
    console.log("CURR HISTORY: ", JSON.stringify(user.chatHistory));

    // update the chatHistory array
    const updatedChatHistory = [...user.chatHistory, newMessage];
    
    // update with the new chat history
    const updatedUser = await context.db.patch(user._id, {
      chatHistory: updatedChatHistory,
    });

    console.log("Updated User: ", JSON.stringify(updatedUser))

    return updatedUser; 
  },
});

// OLD STUFF
// export const saveMessage = mutation({
//   args: {
//     msg: v.string(),
//     clerkId: v.optional(v.string()),
//     type: v.string(),
//   },
//   handler: async (context, args) => {
//     const document = await context.db.insert("message", // insert document into message collection in the database
//     {
//       msg: args.msg,
//       clerkId: args.clerkId ?? '',
//       type: args.type, 
//     });
    
//     return document; 
//   }
// })
