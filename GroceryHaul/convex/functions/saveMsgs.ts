import { mutation } from '../_generated/server';
import { useMutation, useQuery } from 'convex/react';
import { api } from "../_generated/api";
import { v } from "convex/values";

export const updateChatHistory = mutation ({
  args: { 
    clerkId: v.string(),
    message: v.string(),
    type: v.string(), // will be "user" or "chat"
  }, 
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); 

    if (!identity) {
        throw new Error("Not Authenticated");
    }

    // updateUser({
    //   chatHistory: "",
    // });
  }
})

export const saveMessage = mutation({
  args: {
    msg: v.string(),
    clerkId: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (context, args) => {
    const document = await context.db.insert("message", // insert document into message collection in the database
    {
      msg: args.msg,
      clerkId: args.clerkId ?? '',
      type: args.type, 
    });
    
    return document; 
  }
})

