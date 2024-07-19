import { internalMutation, internalQuery } from '../_generated/server';

export const fetchMessages = internalQuery(async ({ db }) => {
  return await db.query('message').order('desc').take(100);
});
