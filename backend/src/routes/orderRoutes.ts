import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { dbOperations } from '../services/DbOperations';
import { getSession, setSession } from '../services/session';
import {
  getDiscountPeriod,
  getInsurancePercentage,
  getShippingCost,
  getUnitPrice,
} from '../services/utils';
const order = new Hono<{ Bindings: Bindings }>();

order.post('/', async (c) => {
  const orderData = await c.req.json();
  const { unitOfMeasurement, productType, products } = orderData;
  const dashboardData = await dbOperations.getData(
    c.env.DASHBOARD_SETTINGS as KVNamespace,
    'dashboard'
  );
  const { discount } = dashboardData;
  const productPrice = getUnitPrice(dashboardData, productType);
  const insurancePercentage = getInsurancePercentage(dashboardData, productType);
  const shippingCost = getShippingCost(dashboardData, productType);
  const orderToken = generateUniqueToken();
  const discountPeriod = getDiscountPeriod(dashboardData, productType);

  const order = new Order(unitOfMeasurement, productType, discount, discountPeriod);

  products.forEach((p) => {
    const product = new Product(
      p.width,
      p.height,
      p.quantity,
      unitOfMeasurement,
      productType,
      productPrice,
      insurancePercentage,
      shippingCost
    );
    order.addProduct(product);
  });

  order.calculateTotalFinalPrice();
  const sessionTimeout: number = 60 * 60; // 1 hour
  await setSession(c, orderToken, order, sessionTimeout);
  return c.json({
    orderToken: orderToken,
    //redirectUrl: 'https://smartglass.webflow.io/product-detail?country=true',
    redirectUrl: 'https://smartglass.webflow.io/contact-form',
  });
});

order.get('/', async (c) => {
  const orderToken: string | undefined = c.req.query('orderToken');
  if (!orderToken) {
    return c.json({ error: 'Order token not provided' }, { status: 400 });
  }
  const order = await getSession(c, orderToken as string);
  if (!order) {
    return c.json({ error: 'Order not found' }, { status: 404 });
  }
  // console.log(order);
  return c.json(order);
});

function generateUniqueToken() {
  const token = crypto.randomUUID();
  return token;
}

export { order };
