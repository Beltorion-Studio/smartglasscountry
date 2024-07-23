import { Hono } from 'hono';
import { sign } from 'hono/jwt';

import { CryptoService } from '../services/CryptoService';
import { Bindings } from '../types/types';

const logIn = new Hono<{ Bindings: Bindings }>();

const cryptoService = new CryptoService();

let hashedAdminPassword: string;

logIn.post('/', async (c) => {
  try {
    const { ADMIN_EMAIL } = c.env;
    hashedAdminPassword = await cryptoService.hashPassword(c.env.ADMIN_PASSWORD);

    if (!hashedAdminPassword) {
      return c.text('Server not ready', 503);
    }
    const requestBody = await c.req.json();
    const { email, password } = requestBody;

    if (!email || !password) {
      return c.text('Email and password are required', 400);
    }
    const incomingHashedPassword = await cryptoService.hashPassword(password);
    if (email === ADMIN_EMAIL && incomingHashedPassword === hashedAdminPassword) {
      const payload = {
        sub: email,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 60 * 50, // expires in 50 minutes
      };
      const secret = 'mySecretKey';
      const token = await sign(payload, secret);
      return c.json({ token });
    }

    return c.text('Invalid credentials', 401);
  } catch (error) {
    console.error('Login error:', error);

    return c.text('Internal Server Error', 500);
  }
});
export default logIn;
