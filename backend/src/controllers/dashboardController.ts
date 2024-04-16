//import { HonoRequest } from 'hono';

import { dbOperations } from '../services/DbOperations';

async function setDashboardData(c) {
  const dashboardData = await c.req.json();
  await dbOperations.putData(c.env.DASHBOARD_SETTINGS, 'dashboard', dashboardData);
  console.log(dashboardData);
  return c.json(dashboardData);
}

async function getDashboardData(c) {
  try {
    const dashboardData = await dbOperations.getData(c.env.DASHBOARD_SETTINGS, 'dashboard');
    console.log(dashboardData);

    if (!dashboardData) {
      return c.json({ error: 'Not found' }, { status: 404 });
    }

    return c.json(dashboardData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
}

export { getDashboardData, setDashboardData };
