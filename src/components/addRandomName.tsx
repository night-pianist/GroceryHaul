// import { mutation } from '../convex/_generated/server';
// import { v } from 'convex/values';

// export const addRandomName = mutation({
//   args: { name: v.string() },
//   handler: async (ctx, args) => {
//     const { name } = args;
//     const newName = await ctx.db.insert('names', { name });
//     return newName;
//   },
// });

// src/addRandomName.ts
import { mutation } from '../convex/_generated/server';
import { v } from 'convex/values';
import { v4 as uuidv4 } from 'uuid';

// Example email generator (you may use a better approach in production)
// const generateEmail = (name: string) => `${name.toLowerCase().replace(' ', '.')}@example.com`;

export const addRandomName = mutation({
  args: { fullName: v.string() },
  handler: async (ctx, args) => {
    const { fullName } = args;
    // const userId = uuidv4();
    // const email = generateEmail(fullName);

    // const newUser = await ctx.db.insert('user', {
    //   fullName,
    // });

    // return newUser;
    return { success: true, message: `Added name: ${fullName}` };
  },
});
