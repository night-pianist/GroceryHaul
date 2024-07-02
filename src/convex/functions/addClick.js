// import { mutation } from 'convex-dev';
import { mutation } from '../_generated/server';
import { Database } from 'convex/_generated/dataModel';

export default mutation(async ({ db }) => {
  await db.table("clicks").insert({
    text: "click me",
    createdAt: new Date(),
  });
});


// const addClick = mutation(async ({ db }) => {
//   await db.table('clicks').insert({
//     text: 'click me',
//     createdAt: new Date(),
//   });
// });

// export default addClick;
