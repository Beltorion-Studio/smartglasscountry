import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { dbOperations } from '../services/kvStorageOperations';

const settings = new Hono<{ Bindings: Bindings }>();

settings.get('/', async (c) => {
  try {
    const settingsData = await dbOperations.getData(
      c.env.PRODUCT_SETTINGS as KVNamespace,
      'productSettings'
    );
    console.log(settingsData);
    if (!settingsData) {
      return c.json({ error: 'Settings data not found' }, { status: 404 });
    }

    return c.json(settingsData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
});

export { settings };
