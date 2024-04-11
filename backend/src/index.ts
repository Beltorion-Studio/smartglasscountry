import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { dashboardRoutes } from './routes/dashboardRoutes';
import { orderRoutes } from './routes/orderRoutes';

type Contex = {
  Bindings: {
    DASHBOARD_SETTINGS: KVNamespace;
  };
};

const app = new Hono<Contex>();
app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello smartglasscountry!');
});

orderRoutes(app);
dashboardRoutes(app);

export default app;
