import { query } from '../_generated/server';
import { v } from "convex/values";

// export const fetchAll2 = query({
//   args: {}, 
//   handler: async (ctx) => { // fetch all messages documents
//     const allMsgs = await ctx.db.query("users").collect();
//     const transformedMsgs = allMsgs.map(msg => ({ // transform the documents to include only the desired fields
//       msg: msg.msg,
//       type: msg.type,
//     }));
//     return transformedMsgs;
//   },
// });


export const fetchAll = query({
  args: {}, 
  handler: async (ctx) => { // fetch all messages documents
    const allMsgs = await ctx.db.query("message").collect();
    const transformedMsgs = allMsgs.map(msg => ({ // transform the documents to include only the desired fields
      msg: msg.msg,
      type: msg.type,
    }));
    return transformedMsgs;
  },
});

export const fetchAllParsed = query({
  args: {}, 
  handler: async (ctx) => { // fetch all messages documents
    const allMsgs = await ctx.db.query("message").collect();
    const transformedMsgs = allMsgs.map(msg => ({ // transform the documents to include only the desired fields
      msg: msg.msg,
      type: msg.type,
    }));
    const parseTransformedMsgs = (message: { type: string; msg: string; }) => {
      return `${message.type}: ${message.msg}`;
    };
    
    const parsedMsgs = transformedMsgs.map(parseTransformedMsgs);
    
    return parsedMsgs; 
  },
});
