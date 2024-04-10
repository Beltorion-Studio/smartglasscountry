import { Hono } from 'hono';

import { getDashboardData, setDashboardData } from '../controllers/dashboardController';
type Contex = {
  Bindings: {
    DASHBOARD_SETTINGS: KVNamespace;
  };
};
export const dashboardRoutes = (app: Hono<Contex>) => {
  app.post('/dashboard', setDashboardData);
  app.get('/dashboard', getDashboardData);
};
