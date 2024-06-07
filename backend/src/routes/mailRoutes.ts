import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { initailazeMailingService } from '../services/mailingServices/mailingService';

const mail = new Hono<{ Bindings: Bindings }>();

mail.get('/', async (c) => {
  try {
    await initailazeMailingService();
    return c.text('Mail route');
  } catch (error) {
    console.error('Error in mail route:', error);
    return c.text('Error in mail route', 500);
  }
});

export { mail };
