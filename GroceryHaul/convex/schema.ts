import { defineSchema, defineTable } from "convex/server"; 
import { v } from "convex/values"; 


export default defineSchema({
    message: defineTable({
        msg: v.string(),
        userId: v.string(),
        type: v.string(), // defines whether it's the chatbot or user's message
    })
    .index("byUserId",["userId"]),

    // userHistory: defineTable({ 

    user: defineTable({ 
        // userId: v.string(),
        userName: v.string(), 
    })
    // .index("byUserId", ["userId"])
    .index("byName", ["userName"])
});
    // user: defineTable({ 
    //     userId: v.string(),
    //     userName: v.string(),
    //     msg: v.string(),
    //     chatHistory: v.optional(v.any()) // stores all messages
    // })
    // .index("byUserId", ["userId"])
    // .index("byUserName", ["userName"]),

    // chat: defineTable({
    //     userId: v.string(),
    //     timestamp: v.number(),
    // })

