// cronTriggerExample.ts

/* export async function handleScheduledEvent(event: ScheduledEvent) {
  console.log('Cron trigger executed. This message is logged every 1 minutes.');
}

addEventListener('scheduled', (event) => {
  event.waitUntil(handleScheduledEvent(event));
}); */
/* export async function handleScheduledEvent(request) {
  return new Response('Hello from your Scheduled Function!', {
    headers: { 'content-type': 'text/plain' },
  });

  //const expiringOrders = await queryExpiringOrders(env.D1_DATABASE);
  //await notifyCustomers(expiringOrders, env.NOTIFICATION_SERVICE);
} */

// scheduler.ts
/*
interface Env {}
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    console.log('Hello from your Scheduled Function!');
    return new Response('Hello from your Scheduled Function!');
  },
};

*/
/*
export async function scheduled(event, env, ctx) {
    ctx.waitUntil(doScheduledEvent());
    // event.waitUntil(doScheduledEvent(event.request));
  }
  
  async function doScheduledEvent() {
    console.log('Hello from your Scheduled Function!');
    return new Response('Hello from your Scheduled Function!');
    // Your scheduled task logic here
  }
 */
