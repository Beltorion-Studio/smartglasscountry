//import { HonoRequest } from 'hono';

import { dbOperations } from '../services/DbOperations';

export const setDashboardData = async (ctx) => {
  const dashboardData = await ctx.req.json();
  await dbOperations.putData(ctx.env.DASHBOARD_SETTINGS, 'dashboard', dashboardData);
  console.log(dashboardData);
  return ctx.json(dashboardData);
};

export const getDashboardData = async (ctx) => {
  try {
    const dashboardData = await dbOperations.getData(ctx.env.DASHBOARD_SETTINGS, 'dashboard');
    console.log(dashboardData);

    if (!dashboardData) {
      return ctx.json({ error: 'Not found' }, { status: 404 });
    }

    return ctx.json(dashboardData);
  } catch (error) {
    console.error(error);
    return ctx.json({ error: 'An error occurred' }, { status: 500 });
  }
};
