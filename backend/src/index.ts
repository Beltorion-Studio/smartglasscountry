import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from 'hono/types';

import { dashboardRoutes } from './routes/dashboardRoutes';
import { formRoutes } from './routes/formRoutes';
import { orderRoutes } from './routes/orderRoutes';

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello smartglasscountry!');
});

orderRoutes(app);
dashboardRoutes(app);
formRoutes(app);

export default app;
