import { Order } from '../models/Order';
import { Product } from '../models/Product';

export const createOrder = async (c) => {
  const orderData = await c.req.json();
  const { unitOfMeasurement, productType, products } = orderData;
  const order = new Order(unitOfMeasurement, productType);

  products.forEach((p) => {
    const product = new Product(p.width, p.height, p.quantity, unitOfMeasurement, productType);
    order.addProduct(product);
  });

  order.calculatePrices();
  console.log(order);

  // await db.saveOrder(order);
  return c.json(order);
};
