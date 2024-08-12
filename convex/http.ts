import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({ 
  path: '/clerk', 
  method: 'POST', 
  handler: httpAction(async (ctx, request) => { 
      const res = await request.text();
      const headerPayload = request.headers; 

      try { 
          const result = await ctx.runAction(internal.clerk.fulfill, {
              payload: res, 
              headers: { 
                  'svix-id': headerPayload.get('svix-id')!, 
                  'svix-signature': headerPayload.get('svix-signature')!,
                  'svix-timestamp': headerPayload.get('svix-timestamp')!,
              }
          });

          switch(result.type) { 
              case 'user.created': 
                await ctx.runMutation(internal.users.createUser, { 
                  clerkId: result.data.id,
                  userName: result.data.first_name + ' ' + result.data.last_name,
                });
              // case 'user.updated':
              //   await ctx.runMutation(internal.users.updateUser, { 
              //       clerkId: result.data.id,
              //       userName: result.data.first_name + ' ' + result.data.last_name,
              //   });
          }
          return new Response(null, { 
              status: 200
          })
      } catch (err) { 
          return new Response(`Webhook Error: ${err}`, { 
              status: 400
          })
      }
  })
})

export default http; 
