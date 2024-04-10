import { Order } from '../models/Order';
import { Product } from '../models/Product';
//import { HonoRequest } from 'hono';

export const createOrder = async (ctx) => {
  const orderData = await ctx.req.json();
  const { unitOfMeasurement, productType, products } = orderData;
  const order = new Order(unitOfMeasurement, productType);

  products.forEach((p) => {
    const product = new Product(p.width, p.height, p.quantity, unitOfMeasurement, productType);
    order.addProduct(product);
  });

  order.calculatePrices();
  console.log(order);

  // await db.saveOrder(order);
  return ctx.json(order);
};
