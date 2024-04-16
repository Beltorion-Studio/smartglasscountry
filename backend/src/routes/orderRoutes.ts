import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { createOrder } from '../controllers/orderController';

export const orderRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post('/order', createOrder);
};
