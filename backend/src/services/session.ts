import { Context } from 'hono';

// Assuming you have a KV namespace binding named SESSION_STORAGE
const SESSION_STORAGE = 'SESSION_STORAGE';

async function setSession(ctx: Context, key: string, value: any, ttl = 900) {
  const stringValue = JSON.stringify(value);
  await ctx.env[SESSION_STORAGE].put(key, stringValue, { expirationTtl: ttl });
}

async function getSession(ctx: Context, key: string) {
  const stringValue = await ctx.env[SESSION_STORAGE].get(key);
  return stringValue ? JSON.parse(stringValue) : null;
}

async function deleteSession(ctx: Context, key: string) {
  await ctx.env[SESSION_STORAGE].delete(key);
}

export { deleteSession, getSession, setSession };
