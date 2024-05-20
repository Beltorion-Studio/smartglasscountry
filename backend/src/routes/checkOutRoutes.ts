import { Hono } from 'hono';
import stripe from 'stripe';

import { getSession } from '../services/session';
import { Bindings } from '../types/types';

const stripeClient = new stripe(
  'sk_test_51LuHdrHiSI5WqDkH3BviYhPE3c0MSwWtpwwxtJCHIqDyQS8H6umJvyiBqyA3A5ehGXI4jrGNSdRkk8fRfL2qgGWf00AHBOvB1b'
);

const checkOut = new Hono<{ Bindings: Bindings }>();

checkOut.get('/', async (c) => {
  //return a text
  return c.text('Checkout route');
});

checkOut.post('/', async (c) => {
  const orderToken: string | undefined = c.req.query('orderToken');
  console.log('Order request:');
  if (!orderToken) {
    return c.json({ error: 'Order token not provided' }, { status: 400 });
  }
  const order = await getSession(c, orderToken as string);
  if (!order) {
    return c.json({ error: 'Order not found' }, { status: 404 });
  }
  const body: {
    products: Array<{
      totalPrice: number;
      quantity: number;
      productType: string;
    }>;
    shippingCost: number;
    insuranceCost: number;
    cratingCost: number;
    discountAmount: number;
    discount: string;
    tax: number;
    subTotal: number;
  } = order;
  try {
    const discount = order.discountAmount * 100;
    const coupon = await createUniqueCoupon(discount);
    console.log(coupon);
    if (!coupon) {
      throw new Error('Coupon could not be created.');
    }
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...body.products.map((product) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: formatProductName(product.productType),
            },
            unit_amount: Math.round(product.totalPrice * 100) / product.quantity,
          },
          quantity: product.quantity,
        })),
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Insurance Cost',
            },
            unit_amount: Math.round(body.insuranceCost * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Crating Cost',
            },
            unit_amount: Math.round(body.cratingCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(body.shippingCost * 100),
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
          },
        },
      ],
      discounts: coupon ? [{ coupon: coupon.id }] : [],
      success_url: 'https://smartglass.webflow.io/smart-center/order-success',
      cancel_url: 'https://smartglass.webflow.io/smart-center/order-canceled',
    });

    return c.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Unable to create Stripe session' }, { status: 500 });
  }
});

async function createUniqueCoupon(discountPercent: number): Promise<stripe.Coupon | null> {
  try {
    const coupon = await stripeClient.coupons.create({
      amount_off: discountPercent,
      currency: 'usd',
      duration: 'once',
    });
    return coupon;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function formatProductName(product: string): string {
  if (product === 'smartFilm') {
    return 'Smart Film';
  }
  if (product === 'smartGlass') {
    return 'Smart Glass';
  }
  if (product === 'igu') {
    return 'IGU';
  }
  return product;
}

export { checkOut };
