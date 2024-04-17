import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { createOrder, getOrder } from '../controllers/orderController';

export const orderRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post('/login', createOrder);
  app.get('/login', getOrder);
};
