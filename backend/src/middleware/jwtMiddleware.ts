import { MiddlewareHandler } from 'hono';
import { decode, sign, verify } from 'hono/jwt';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  // Extract the Authorization header
  console.log('Authorization');
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.text('Unauthorized', 401);
  }

  // Extract the token from the Authorization header

  try {
    const token = authHeader.split(' ')[1];
    console.log({ token });
    const tokenToVerify = token;
    const secretKey = 'mySecretKey';

    const decodedPayload = await verify(tokenToVerify, secretKey);
    console.log({ decodedPayload });
    // Replace 'your-secret' with the appropriate secret for your JWT
    // const secret = new TextEncoder().encode('your-secret');

    // Decode and verify the JWT token
    //const { payload } = await jwtVerify(token, secret);

    // You can now inject the user information into the context
    // c.set('user', payload);

    // Continue to the next middleware or route handler
    return next();
  } catch (err) {
    // If token verification fails, return an Unauthorized error
    console.error(err);
    return c.text('Unauthorized', 401);
  }
};
