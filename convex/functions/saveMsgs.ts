import { mutation } from '../_generated/server';
import { useMutation, useQuery } from 'convex/react';
import { api } from "../_generated/api";
import { v } from "convex/values";

export const updateChatHistory = mutation ({
  args: { 
    userId: v.string(),
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

