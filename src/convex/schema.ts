import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"; 

export default defineSchema({
    chatHistory: defineTable({
        messageId: v.string(),
        userId: v.string(),
        timestamp: v.number(),
        message: v.string(),
    })
    .index("byUserId", ["userId"])
    .index("byTimestamp", ["timestamp"]),
    

    user: defineTable({
        userId: v.string(),
        email: v.string(),
        fullName: v.string(),
    })
    .index('byUserId', ['userId'])
    .index('byEmail', ['email'])
    .index('byName', ['fullName']),
});



// const schema = defineSchema({
//     messages: defineTable({
//       user: v.string(),
//       message: v.string(),
//       timestamp: v.number(),
//     }),
//   });
  
//   export default schema;