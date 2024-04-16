import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { getDashboardData, setDashboardData } from '../controllers/dashboardController';

export const dashboardRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.post('/dashboard', setDashboardData);
  app.get('/dashboard', getDashboardData);
};
