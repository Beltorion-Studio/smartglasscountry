import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { dbOperations } from '../services/DbOperations';
import { getUnitPrice } from '../services/utils';
//import { HonoRequest } from 'hono';

async function createOrder(c) {
  const orderData = await c.req.json();
  const { unitOfMeasurement, productType, products } = orderData;
  //const order = await Order.createOrder(ctx, unitOfMeasurement, productType);
  const dashboardData = await dbOperations.getData(c.env.DASHBOARD_SETTINGS, 'dashboard');
  const { discount } = dashboardData;
  const productPrice = getUnitPrice(dashboardData, productType);
  console.log(productPrice);

  const order = new Order(unitOfMeasurement, productType, discount);

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

  order.calculatePrices();
  //console.log(order);
  return c.json(order);
}

export { createOrder };
