import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { dbOperations } from '../services/DbOperations';
import { getSession, setSession } from '../services/session';
import { getUnitPrice } from '../services/utils';
//import { HonoRequest } from 'hono';

async function createOrder(c) {
  const orderData = await c.req.json();
  const { unitOfMeasurement, productType, products } = orderData;
  const dashboardData = await dbOperations.getData(c.env.DASHBOARD_SETTINGS, 'dashboard');
  const { discount } = dashboardData;
  const productPrice = getUnitPrice(dashboardData, productType);
  const orderToken = generateUniqueToken();
  const order = new Order(unitOfMeasurement, productType, discount);
  console.log(order);

  products.forEach((p) => {
    const product = new Product(
      p.width,
      p.height,
      p.quantity,
      unitOfMeasurement,
      productType,
      productPrice
    );
    order.addProduct(product);
  });

  order.calculateReviewPrice();
  await setSession(c, orderToken, order, 900);
  return c.json({
    orderToken: orderToken,
    // redirectUrl: 'https://smartglass.webflow.io/product-detail?country=true',
    redirectUrl: 'https://smartglass.webflow.io/contact-form',
  });
}

async function getOrder(c) {
  const orderToken = c.req.query('orderToken');

  const order = await getSession(c, orderToken);
  if (!order) {
    return c.json({ error: 'Order not found' }, { status: 404 });
  }

  return c.json(order);
}

function generateUniqueToken() {
  const token = crypto.randomUUID();
  return token;
}
export { createOrder, getOrder };
