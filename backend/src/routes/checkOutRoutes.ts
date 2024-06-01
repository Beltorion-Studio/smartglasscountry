import { Hono } from 'hono';
import stripe from 'stripe';

import { CheckoutServices } from '../services/CheckoutServices';
import { getSession } from '../services/session';
import { Bindings } from '../types/types';

const checkOut = new Hono<{ Bindings: Bindings }>();

checkOut.get('/', async (c) => {
  //return a text
  return c.text('Checkout route');
});

checkOut.post('/', async (c) => {
  const stripeClient = new stripe(c.env.STRIPE_CLIENT as string);
  const orderToken: string | undefined = c.req.query('orderToken');
  const checkoutServices = new CheckoutServices();
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
      unitOfMeasurement: 'mm' | 'inches';
      size: number;
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
    const coupon = await checkoutServices.createUniqueCoupon(stripeClient, discount);

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
              name: checkoutServices.formatProductName(
                product.productType,
                product.size,
                product.unitOfMeasurement
              ),
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
      metadata: {
        orderToken,
      },
      success_url: `https://smartglass.webflow.io/smart-center/order-success?orderCompleted=true`,
      cancel_url: 'https://smartglass.webflow.io/smart-center/order-canceled',
    });
    return c.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Unable to create Stripe session' }, { status: 500 });
  }
});

export { checkOut };
