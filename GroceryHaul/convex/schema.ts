import { defineSchema, defineTable } from "convex/server"; 
import { v } from "convex/values"; 


export default defineSchema({
    // users: defineTable({
    //     userId: v.string(),
    //     userName: v.string(),
    //     email: v.string(),
    //     chatHistory: v.array(v.object({
    //         msg: v.string(),
    //         type: v.string(), // e.g., 'user' or 'bot'
    //       })),
    // })
    // .index("byUserId",["userId"]),

    message: defineTable({
        msg: v.string(),
        userId: v.string(),
        type: v.string(), // defines whether it's the chatbot or user's message
    })
    .index("byUserId",["userId"]),

    user: defineTable({
        userId: v.string(),
        userName: v.string(),
    })
    .index("byUserId",["userId"]),
});
