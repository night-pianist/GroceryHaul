import { defineSchema, defineTable } from "convex/server"; 
import { v } from "convex/values"; 

export default defineSchema({
    users: defineTable({
        userName: v.string(),
        clerkId: v.string(), // this the Clerk ID, stored in the subject JWT field
        chatHistory: v.array(v.object({
            type: v.string(), // defines whether it's the chatbot or user's message
            text: v.string(),
        })),
      }).index("byClerkId", ["clerkId"]),

});
