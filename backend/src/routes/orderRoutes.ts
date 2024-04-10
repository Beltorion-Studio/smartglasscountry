import { Hono } from 'hono';

import { createOrder } from '../controllers/orderController';
type Contex = {
  Bindings: {
    DASHBOARD_SETTINGS: KVNamespace;
  };
};
export const orderRoutes = (app: Hono<Contex>) => {
  app.post('/order', createOrder);
};
