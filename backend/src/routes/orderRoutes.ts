import { Hono } from 'hono';

import { createOrder } from '../controllers/orderController';

export const orderRoutes = (app: Hono) => {
  app.post('/order', createOrder);
};
