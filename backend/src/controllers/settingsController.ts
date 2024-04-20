import { dbOperations } from '../services/DbOperations';

async function getSettings(c) {
  try {
    const settingsData = await dbOperations.getData(c.env.PRODUCT_SETTINGS, 'productSettings');

    if (!settingsData) {
      return c.json({ error: 'Not found' }, { status: 404 });
    }

    return c.json(settingsData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
}

export { getSettings };
