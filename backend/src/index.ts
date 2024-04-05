import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Product } from './models/Product';
import { Order } from './models/Order';

const app = new Hono();
app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/order', async (c) => {
  // Parse the incoming request body as JSON
  const orderData = await c.req.json();
  const unitOfMeasurement = orderData.unitOfMeasurement;
  const productType = orderData.productType;
  const order = new Order(unitOfMeasurement, productType);
  orderData.products.forEach((p: Product) => {
    const product = new Product(p.width, p.height, p.quantity, unitOfMeasurement, productType);
    order.addProduct(product);
  });
  order.calculatePrices();

  console.log(order);

  // await db.saveOrder(order);

  // Send a response back to the client
  return c.json(order);
});

export default app;
