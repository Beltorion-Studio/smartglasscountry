import { Hono } from 'hono';
import { Bindings } from 'hono/types';
import stripe from 'stripe';

const checkOut = new Hono<{ Bindings: Bindings }>();

checkOut.post('/create-checkout-session', async (c) => {
  const { totalPrice, shippingCost, productName } = await c.req.json();
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          name: productName,
          amount: totalPrice, // Make sure this is in cents
          currency: 'usd',
          quantity: 1,
        },
      ],
      shipping_rates: ['your_shipping_rate_id'], // Optional: if you have predefined shipping rates
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      success_url: 'https://yourdomain.com/success', // URL to which the customer is redirected after payment
      cancel_url: 'https://yourdomain.com/cancel', // URL to which the customer is redirected if they cancel payment
    });

    return c.json({ sessionId: session.id });
  } catch (error) {
    return c.json({ error: 'Order not found' }, { status: 400 });
  }
});

checkOut.get('/', async (c) => {
  try {
    return c.json({ message: 'Checkout info endpoint' });
  } catch (error) {
    return c.json({ error: 'Order not found' }, { status: 500 });
  }
});

export { checkOut };
