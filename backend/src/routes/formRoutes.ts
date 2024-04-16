import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { validateForm } from '../controllers/formController';
export const formRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post('/form', validateForm);
};
