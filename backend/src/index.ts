import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { orderRoutes } from './routes/orderRoutes';

const app = new Hono();
app.use('*', cors());

app.get('/', (c) => {
  return c.text('Hello smartglasscountry!');
});

orderRoutes(app);

export default app;
