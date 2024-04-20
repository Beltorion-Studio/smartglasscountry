import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { getSettings } from '../controllers/settingsController';

export const settingRoutes = (app: Hono<{ Bindings: Bindings }>) => {
  app.get('/settings', getSettings);
};
