import { Hono } from 'hono';
import stripe from 'stripe';

import { CheckoutServices } from '../services/CheckoutServices';
import { getSession } from '../services/session';
import { Bindings, OrderData } from '../types/types';

const deposit = new Hono<{ Bindings: Bindings }>();

deposit.get('/', async (c) => {
  return c.text('deposit route');
});

deposit.post('/', async (c) => {
  const stripeClient = new stripe(c.env.STRIPE_CLIENT as string);
  const orderToken: string | undefined = c.req.query('orderToken');
  const checkoutServices = new CheckoutServices();

  if (!orderToken) {
    return c.json({ error: 'Order token not provided' }, { status: 400 });
  }
  const order: OrderData | undefined = await getSession(c, orderToken as string);
  if (!order) {
    return c.json({ error: 'Order not found' }, { status: 404 });
  }
  try {
    const discount = Math.round(order.discountAmount * 100);
    const coupon = await checkoutServices.createUniqueCoupon(stripeClient, discount);

    if (!coupon) {
      throw new Error('Coupon could not be created.');
    }
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: createLineItems(order, checkoutServices),
      mode: 'payment',
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

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function createLineItems(
  order: OrderData,
  checkoutServices: CheckoutServices
): stripe.Checkout.SessionCreateParams.LineItem[] {
  const lineItems: stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Deposit',
          description: 'Total charge for your order',
        },
        unit_amount: 50000, // $500 in cents
      },
      quantity: 1,
    },
    ...order.products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: checkoutServices.formatProductName(
            product.productType,
            product.size,
            product.unitOfMeasurement
          ),
          description: `Quantity: ${product.quantity}, Total Price: ${formatPrice(product.totalPrice)}`,
        },
        unit_amount: 0,
      },
      quantity: product.quantity,
    })),
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Total Regular Price',
          description: `Total Regular Price: ${formatPrice(order.totalRegularPrice)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Insurance Cost',
          description: `Insurance Cost: ${formatPrice(order.insuranceCost)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Crating Cost',
          description: `Crating Cost: ${formatPrice(order.cratingCost)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping Cost',
          description: `Shipping Cost: ${formatPrice(order.shippingCost)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Subtotal',
          description: `Subtotal: ${formatPrice(order.subTotal)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Discount',
          description: `Discount: -${formatPrice(order.discountAmount)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Total final price',
          description: `Total final price: ${formatPrice(order.totalFinalPrice)}`,
        },
        unit_amount: 0,
      },
      quantity: 1,
    },
  ];

  return lineItems;
}

export { deposit };
