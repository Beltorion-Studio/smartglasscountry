import { Context, MiddlewareHandler, Next } from 'hono';
import { verify } from 'hono/jwt';

export const authMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
  // Extract the Authorization header

  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      status: 401,
    });
  }
  try {
    const token = authHeader.split(' ')[1];
    const secretKey = 'mySecretKey';
    await verify(token, secretKey);
    return next();
  } catch (err) {
    return c.json(
      {
        success: false,
        message: 'Invalid JWT token.',
      },
      401
    );
  }
};
