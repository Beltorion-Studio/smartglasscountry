import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from 'hono/types';

import { dashboardRoutes } from './routes/dashboardRoutes';
import { formRoutes } from './routes/formRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { settingRoutes } from './routes/settingsRoutes';

const app = new Hono<{ Bindings: Bindings }>();
const corsOptions = {
  origin: '*',
  allowHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 86400,
};

app.use('*', cors(corsOptions));

app.get('/', (c) => {
  return c.text('Hello smartglasscountry!');
});

orderRoutes(app);
dashboardRoutes(app);
formRoutes(app);
settingRoutes(app);

export default app;
