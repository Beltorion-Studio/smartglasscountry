import { Context } from 'hono';

// Assuming you have a KV namespace binding named SESSION_STORAGE
const SESSION_STORAGE = 'SESSION_STORAGE';

async function setSession(c: Context, key: string, value: any, ttl = 900) {
  const stringValue = JSON.stringify(value);
  await c.env[SESSION_STORAGE].put(key, stringValue, { expirationTtl: ttl });
}

async function getSession(c: Context, key: string) {
  const stringValue = await c.env[SESSION_STORAGE].get(key);
  return stringValue ? JSON.parse(stringValue) : null;
}

async function deleteSession(c: Context, key: string) {
  await c.env[SESSION_STORAGE].delete(key);
}

export { deleteSession, getSession, setSession };
