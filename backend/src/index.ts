import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from 'hono/types';

import { checkOut } from './routes/checkOutRoutes';
import dashboard from './routes/dashboardRoutes';
import { deposit } from './routes/depositRoutes';
import { form } from './routes/formRoutes';
import logIn from './routes/logInRoutes';
import { mail } from './routes/mailRoutes';
import { order } from './routes/orderRoutes';
import { sample } from './routes/sampleRoutes';
import { settings } from './routes/settingsRoutes';
import webhook from './routes/webhook';

const app = new Hono<{ Bindings: Bindings }>();
const corsOptions = {
  origin: '*',
  allowHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 86400,
};

app.use('*', cors(corsOptions));

// JWT Middleware for verifying tokens

app.get('/', (c) => {
  return c.text('Hello smartglasscountry!');
});

app.route('/order', order);
app.route('/dashboard', dashboard);
app.route('/form', form);
app.route('/settings', settings);
app.route('/login', logIn);
app.route('/samples', sample);
app.route('/checkout', checkOut);
app.route('/webhook', webhook);
app.route('/deposit', deposit);
app.route('/mail', mail);

export default app;
