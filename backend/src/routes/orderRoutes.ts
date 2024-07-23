import { Hono } from 'hono';

import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { getUserEmailAndNameByOrderToken } from '../services/D1DatabaseOperations';
import { dbOperations } from '../services/kvStorageOperations';
import { buildOrderDetailsTemplate } from '../services/mailingServices/emailTemplates/orderDetailsTemplate';
import { sendEmail } from '../services/mailingServices/mailingService';
import sanitizeData from '../services/sanitizeData';
import { getSession, setSession } from '../services/session';
import {
  getCratingCost,
  getDiscountPeriod,
  getInsurancePercentage,
  getMinOrderQuantity,
  getShippingCost,
  getUnitPrice,
} from '../services/utils';
import { Bindings, OrderData, OrderFormData } from '../types/types';
import { DashboardData } from '../types/types';
const order = new Hono<{ Bindings: Bindings }>();

order.post('/', async (c) => {
  const orderData: OrderFormData = await c.req.json();
  let orderToken: string | undefined = c.req.query('orderToken');
  const sanitizedOrderData = sanitizeData(orderData) as OrderFormData;
  console.log(sanitizedOrderData);
  const { unitOfMeasurement, productType, products } = sanitizedOrderData;
  const dashboardData = (await dbOperations.getData(
    c.env.DASHBOARD_SETTINGS as KVNamespace,
    'dashboard'
  )) as DashboardData;
  let redirectUrl;
  const { discount } = dashboardData;
  const productPrice = getUnitPrice(dashboardData, productType);
  const insurancePercentage = getInsurancePercentage(dashboardData, productType);
  const shippingCost = getShippingCost(dashboardData, productType);
  const discountPeriod = getDiscountPeriod(dashboardData, productType);
  const minOrderQuantity = getMinOrderQuantity(dashboardData, productType);
  const cratingCost = getCratingCost(dashboardData, productType);

  const order = new Order(
    unitOfMeasurement,
    productType,
    Number(discount),
    discountPeriod,
    minOrderQuantity,
    cratingCost
  );

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
  const sessionTimeout: number = 60 * 120; // 2 hour
  if (!orderToken) {
    orderToken = generateUniqueToken();
    await setSession(c, orderToken, order, sessionTimeout);
    redirectUrl = 'https://smartglass.webflow.io/contact-form';
    //redirectUrl = 'https://smartglass.webflow.io/product-detail?country=true';
  } else {
    await setSession(c, orderToken, order, sessionTimeout);

    redirectUrl = 'https://smartglass.webflow.io/product-detail';
  }
  return c.json({
    orderToken: orderToken,
    //redirectUrl: 'https://smartglass.webflow.io/product-detail?country=true',
    redirectUrl: redirectUrl,
  });
});

order.get('/', async (c) => {
  const orderToken: string | undefined = c.req.query('orderToken');
  const pageIdentifier: string | undefined = c.req.query('pageIdentifier');

  if (!orderToken) {
    return c.json({ error: 'Order token not provided' }, { status: 400 });
  }
  const order = await getSession(c, orderToken as string);
  if (!order) {
    return c.json({ error: 'Order not found' }, { status: 404 });
  }
  if (pageIdentifier !== 'calculator') {
    await sendOrderDetailsEmail(order, orderToken, c.env.DB);
  }

  // console.log(order);
  return c.json(order);
});

function generateUniqueToken() {
  const token = crypto.randomUUID();
  return token;
}

async function sendOrderDetailsEmail(
  order: OrderData,
  orderToken: string,
  DB: D1Database
): Promise<void> {
  const userInfo = await getUserEmailAndNameByOrderToken(DB, orderToken);
  if (
    !userInfo ||
    !userInfo.success ||
    !userInfo.email ||
    !userInfo.userName ||
    !userInfo.orderId
  ) {
    throw new Error('Failed to get user info');
  }

  const senderEmail: string = 'info@mail2.smartglasscountry.com';
  const recipientEmail: string = userInfo.email;
  const customerName: string = userInfo.userName;

  const html = buildOrderDetailsTemplate(order, customerName);
  const subject: string = `Hello ${customerName}, your have some items in your shopping cart.`;
  const response = await sendEmail(senderEmail, recipientEmail, subject, html);
  if (!response) {
    throw new Error('Failed to send email');
  }
}
export { order };
