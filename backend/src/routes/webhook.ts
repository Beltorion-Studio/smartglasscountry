import { Hono } from 'hono';
import stripe from 'stripe';

import { deleteSession } from '../services/session';
import { Bindings } from '../types/types';
const webhook = new Hono<{ Bindings: Bindings }>();

webhook.post('/', async (c) => {
  const stripeClient = new stripe(c.env.STRIPE_CLIENT);
  const stripeSignature = c.req.header('stripe-signature');
  if (!stripeSignature) return c.json({ error: 'No stripe signature' }, { status: 400 });

  try {
    // Verify the event by signing secret
    const stripeWebhookSecret = c.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeWebhookSecret) {
      throw new Error('No STRIPE_WEBHOOK_SECRET');
    }
    const event = await stripeClient.webhooks.constructEventAsync(
      await c.req.text(),
      stripeSignature,
      stripeWebhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as stripe.Checkout.Session;

      const { orderToken } = session.metadata;
      if (!orderToken) {
        throw new Error('No order token');
      }

      await deleteSession(c, orderToken);
    }

    return c.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return c.json({ error: 'Webhook processing error' }, { status: 400 });
  }
});

webhook.get('/', async (c) => {
  //return a text
  return c.text('webhook');
});

export default webhook;
