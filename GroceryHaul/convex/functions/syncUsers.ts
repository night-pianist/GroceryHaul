import { mutation } from '../_generated/server';
import { v } from "convex/values"; 

export const syncUsers = mutation({
    args: {
      userName: v.string(),
      clerkId: v.string()
    },
    handler: async (context, { userName, clerkId }) => {
      // Check if user exists
      const existingUser = await context.db.query("users").withIndex("byClerkId", q => q.eq("clerkId", clerkId)).first();
    
      if (existingUser) {
        // Update existing user
        // await context.db.update(existingUser._id, { userName });
      } else {
        // Create new user
        await context.db.insert("users", { userName, clerkId });
      }
    }
  });
  

// export default mutation(async ({ db }, { userId, userName, clerkId }: { userId: string; userName: string; clerkId: string }) => {
//     // Assuming `db.query` or `db.insert` are the correct methods based on your setup.
    
//     // Check if user exists
//     const existingUser = await db.query("users").withIndex("byClerkId", q => q.eq("clerkId", clerkId)).first();
    
//     if (existingUser) {
//       // Update existing user
//     //   await db.update(existingUser._id, { email, firstName, lastName });
//     } else {
//       // Create new user
//       await db.insert("users", { userId, userName, clerkId });
//     }
//   });

