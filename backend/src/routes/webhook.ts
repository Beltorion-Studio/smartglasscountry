import { Hono } from 'hono';
import stripe from 'stripe';

import {
  getUserEmailAndNameByOrderToken,
  insertDepositOrder,
} from '../services/D1DatabaseOperations';
import { buildOrderConfirmationTemplate } from '../services/mailingServices/emailTemplates/orderConfirmationTemplate';
import { sendEmail } from '../services/mailingServices/mailingService';
import { deleteSession, getSession } from '../services/session';
import { Bindings, OrderData } from '../types/types';

const webhook = new Hono<{ Bindings: Bindings }>();

webhook.post('/', async (c) => {
  const stripeClient = new stripe(c.env.STRIPE_CLIENT);
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET;
  const webhookStripeSignatureHeader = c.req.header('stripe-signature');
  if (!webhookStripeSignatureHeader) {
    console.error('No stripe signature');
    return c.json({ error: 'No stripe signature' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('No STRIPE_WEBHOOK_SECRET');
    throw new Error('No STRIPE_WEBHOOK_SECRET');
  }

  let event;
  try {
    const webhookRawBody = await c.req.text();

    // Verify the event by signing secret
    event = await stripeClient.webhooks.constructEventAsync(
      webhookRawBody,
      webhookStripeSignatureHeader,
      webhookSecret
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
      if (!orderToken) {
        console.error('No order token');
        throw new Error('No order token');
      }
      const order = (await getSession(c, orderToken as string)) as OrderData;
      if (metadata?.isDeposit === 'true') {
        await sendOrderDetailsEmail(order, orderToken, true, c.env.DB, c.env.RESEND_API_KEY);
        const insertDepositOrderToDB = await insertDepositOrder(c.env.DB, order, orderToken);
        if (!insertDepositOrderToDB) {
          throw new Error('Failed to insert Deposit order data into the database');
        }
      } else {
        await sendOrderDetailsEmail(order, orderToken, false, c.env.DB, c.env.RESEND_API_KEY);
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
async function sendOrderDetailsEmail(
  order: OrderData,
  orderToken: string,
  isDeposit: boolean,
  DB: D1Database,
  RESEND_API_KEY: string
): Promise<void> {
  const userInfo = await getUserEmailAndNameByOrderToken(DB, orderToken);
  if (
    !userInfo ||
    !userInfo.success ||
    !userInfo.email ||
    !userInfo.userName ||
    !userInfo.orderId ||
    !userInfo.phone
  ) {
    throw new Error('Failed to get user info');
  }

  const recipientEmail: string = userInfo.email;
  const customerName: string = userInfo.userName;
  const customerPhone: string = userInfo.phone;
  const formattedOrderId: string = formatOrderId(userInfo.orderId);
  const subjectText: string = isDeposit ? 'deposit' : 'order';
  const html = buildOrderConfirmationTemplate(order, customerName, formattedOrderId, isDeposit);
  const customerSubject: string = `Hello ${customerName}, your ${subjectText} has been processed`;
  const companySubject: string = isDeposit
    ? `You got a new deposit order from ${customerName}. The phone number is: ${customerPhone}. The Email is ${recipientEmail}.`
    : `You got a new order from ${customerName}. The phone number is: ${customerPhone}. The Email is ${recipientEmail}.`;
  const response = await sendEmail(
    recipientEmail,
    customerSubject,
    companySubject,
    html,
    RESEND_API_KEY
  );
  if (!response) {
    throw new Error('Failed to send email');
  }

  function formatOrderId(orderId: number) {
    return orderId.toString().padStart(7, '0');
  }
}
export default webhook;
