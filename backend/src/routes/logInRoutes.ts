import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { logIn } from '../controllers/logInController';

export const orderRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post('/login', logIn);
};
