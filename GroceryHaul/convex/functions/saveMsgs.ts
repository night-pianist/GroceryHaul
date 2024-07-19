import { internalMutation } from '../_generated/server';

export const saveMessage = internalMutation(async ({ db }, { msg, userId, type }) => {
  await db.insert('message', { msg, userId, type });
});

// import { internalMutation } from '../_generated/server';
// import { Message } from './types';

// export const saveMessage = internalMutation(async ({ db }, message: Message) => {
//     const { msg, userId, type } = message;
//     await db.insert('message', { msg, userId, type });
// });