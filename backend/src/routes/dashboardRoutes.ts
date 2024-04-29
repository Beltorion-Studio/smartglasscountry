import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { authMiddleware } from '../middleware/jwtMiddleware';
import { CryptoService } from '../services/CryptoService';
import { dbOperations } from '../services/DbOperations';
//const secretKey = 'your-secret-key-for-encryption';
const cryptoService = new CryptoService();

const dashboard = new Hono<{ Bindings: Bindings }>();

dashboard.get('/', authMiddleware, async (c) => {
  try {
    const dashboardData = await dbOperations.getData(
      c.env.DASHBOARD_SETTINGS as KVNamespace,
      'dashboard'
    );
    console.log(dashboardData);

    if (!dashboardData) {
      return c.json({ error: 'Not found' }, { status: 404 });
    }

    if (dashboardData.apiKey) {
      //  dashboardData.apiKey = maskApiKey(await cryptoService.decrypt(dashboardData.apiKey));
    }

    return c.json(dashboardData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
});

dashboard.post('/', async (c) => {
  const dashboardData = await c.req.json();

  // Optional: Encrypt the apiKey if present
  if (dashboardData.apiKey) {
    // dashboardData.apiKey = await cryptoService.encrypt(dashboardData.apiKey);
  }
  await dbOperations.putData(c.env.DASHBOARD_SETTINGS as KVNamespace, 'dashboard', dashboardData);
  const productSettings: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(dashboardData)) {
    if (key.endsWith('Height') || key.endsWith('Width')) {
      productSettings[key] = value as string;
    }
  }

  if (dashboardData.apiKey) {
    dashboardData.apiKey = cryptoService.maskApiKey(dashboardData.apiKey);
  }

  return c.json(dashboardData);
});

export default dashboard;
