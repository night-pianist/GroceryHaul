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
    users: defineTable({
        userName: v.string(),
        clerkId: v.string(), // this the Clerk ID, stored in the subject JWT field
      }).index("byClerkId", ["clerkId"]),
});
