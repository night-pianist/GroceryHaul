import { query } from '../_generated/server';
import { v } from "convex/values";


export const fetchAll2 = query({
  args: {}, 
  handler: async (context) => { // fetch all messages documents
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

    const chatHistory = user.chatHistory;

    // transform the chat history 
    const transformedMsgs = chatHistory.map(msg => ({
      msg: msg.text,
      type: msg.type,
    }));

    return transformedMsgs;
  },
});

export const fetchAllParsed2 = query({
  args: {}, 
  handler: async (context) => { // fetch all messages documents
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

    const chatHistory = user.chatHistory;

    // fransform the chat history 
    const transformedMsgs = chatHistory.map(msg => ({
      msg: msg.text,
      type: msg.type,
    }));

    const parseTransformedMsgs = (message: { type: string; msg: string; }) => {
      return `${message.type}: ${message.msg}`;
    };
    
    const parsedMsgs = transformedMsgs.map(parseTransformedMsgs);
    
    return parsedMsgs; 
  },
});


// OLD STUFF
// export const fetchAll = query({
//   args: {}, 
//   handler: async (ctx) => { // fetch all messages documents
//     const allMsgs = await ctx.db.query("message").collect();
//     const transformedMsgs = allMsgs.map(msg => ({ // transform the documents to include only the desired fields
//       msg: msg.msg,
//       type: msg.type,
//     }));
//     return transformedMsgs;
//   },
// });

// export const fetchAllParsed = query({
//   args: {}, 
//   handler: async (context) => { // fetch all messages documents
    // const identity = await context.auth.getUserIdentity();
    // console.log("IDENTITY IS: ", JSON.stringify(identity));

    // if (!identity) {
    //   throw new Error("Unauthenticated call to mutation");
    // }

    // const user = await context.db.query('users')
    //   .withIndex('byClerkId', (q) => q.eq("clerkId", identity.subject))
    //   .first();

    // if (!user) {
    //   throw new Error("Unauthenticated call to mutation");
    // }

    // const chatHistory = user.chatHistory;

    // // Transform the chat history to include only the desired fields
    // const transformedMsgs = chatHistory.map(msg => ({
    //   msg: msg.text,
    //   type: msg.type,
    // }));

    // const parseTransformedMsgs = (message: { type: string; msg: string; }) => {
    //   return `${message.type}: ${message.msg}`;
    // };
    
    // const parsedMsgs = transformedMsgs.map(parseTransformedMsgs);
    
    // return parsedMsgs; 
//   },
// });

