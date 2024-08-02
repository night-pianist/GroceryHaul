import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
// import type { WebhookEvent } from "@clerk/backend";
// import { Webhook } from "svix";

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
              case 'user.updated':
                  await ctx.runMutation(internal.users.update, { 
                      clerkId: result.data.id,
                      userName: result.data.first_name + ' ' + result.data.last_name,
                  });
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

// http.route({
//   path: "/clerk",
//   method: "POST",
//   handler: httpAction(async (ctx, request) => {
//     const event = await validateRequest(request);
//     if (!event) {
//       return new Response("Error occured", { status: 400 });
//     }
//     switch (event.type) {
//       case "user.created": // intentional fallthrough
//       case "user.updated":
//         await ctx.runMutation(internal.users.upsertFromClerk, {
//           data: event.data,
//         });
//         break;

//       case "user.deleted": {
//         const clerkUserId = event.data.id!;
//         await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
//         break;
//       }
//       default:
//         console.log("Ignored Clerk webhook event", event.type);
//     }

//     return new Response(null, { status: 200 });
//   }),
// });

// async function validateRequest(req: Request): Promise<WebhookEvent | null> {
//   const payloadString = await req.text();
//   const svixHeaders = {
//     "svix-id": req.headers.get("svix-id")!,
//     "svix-timestamp": req.headers.get("svix-timestamp")!,
//     "svix-signature": req.headers.get("svix-signature")!,
//   };
//   const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
//   try {
//     return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
//   } catch (error) {
//     console.error("Error verifying webhook event", error);
//     return null;
//   }
// }

// export default http;