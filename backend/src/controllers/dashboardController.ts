//import { HonoRequest } from 'hono';
import { CryptoService } from '../services/CryptoService';
import { dbOperations } from '../services/DbOperations';
const secretKey = 'your-secret-key-for-encryption';
const cryptoService = new CryptoService(secretKey);

async function setDashboardData(c) {
  const dashboardData = await c.req.json();
  if (dashboardData.apiKey) {
    // dashboardData.apiKey = await cryptoService.encrypt(dashboardData.apiKey);
  }
  await dbOperations.putData(c.env.DASHBOARD_SETTINGS, 'dashboard', dashboardData);

  if (dashboardData.apiKey) {
    dashboardData.apiKey = cryptoService.maskApiKey(dashboardData.apiKey);
  }
  return c.json(dashboardData);
}

async function getDashboardData(c) {
  try {
    const dashboardData = await dbOperations.getData(c.env.DASHBOARD_SETTINGS, 'dashboard');
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
}

export { getDashboardData, setDashboardData };
