import { Hono } from 'hono';
import stripe from 'stripe';

import { deleteSession } from '../services/session';
import { Bindings } from '../types/types';

const webhook = new Hono<{ Bindings: Bindings }>();

webhook.post('/', async (c) => {
  const stripeClient = new stripe(c.env.STRIPE_CLIENT);
  const stripeWebhookSecret = c.env.STRIPE_WEBHOOK_SECRET;
  const stripeSignature = c.req.header('stripe-signature');
  if (!stripeSignature) {
    console.error('No stripe signature');
    return c.json({ error: 'No stripe signature' }, { status: 400 });
  }

  if (!stripeWebhookSecret) {
    console.error('No STRIPE_WEBHOOK_SECRET');
    throw new Error('No STRIPE_WEBHOOK_SECRET');
  }

  let event;
  try {
    const rawBody = await c.req.text();
    console.log('Raw Body:', rawBody);
    console.log('Stripe Signature:', stripeSignature);

    // Verify the event by signing secret
    event = await stripeClient.webhooks.constructEventAsync(
      rawBody,
      stripeSignature,
      stripeWebhookSecret
    );
  } catch (err) {
    if (err instanceof stripe.errors.StripeSignatureVerificationError) {
      console.error('Webhook signature verification failed due to incorrect signature:', err);
    } else {
      console.error('Webhook signature verification failed:', err);
    }
    return c.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as stripe.Checkout.Session;
      const { metadata } = session;
      const orderToken = metadata ? metadata.orderToken : null;
      console.log(orderToken);
      if (!orderToken) {
        console.error('No order token');
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
  // Return a text

  return c.text('stripe webhook route');
});

export default webhook;
