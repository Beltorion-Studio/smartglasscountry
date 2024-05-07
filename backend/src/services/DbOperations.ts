// dbOperations.ts

// Assuming KVNamespace is the type for your Cloudflare Workers KV instance
// It should be defined in your Cloudflare Workers environment or you may need
// to define it appropriately based on the actual API provided by Cloudflare.
interface KVNamespace {
  put(key: string, value: string, options?: { expirationTtl: number }): Promise<void>;
  get(key: string, type: 'json'): Promise<any>;
  delete(key: string): Promise<void>;
}

const putData = async (
  kv: KVNamespace,
  key: string,
  value: string,
  secondsFromNow?: number
): Promise<void> => {
  const stringValue = JSON.stringify(value);
  if (secondsFromNow) {
    await kv.put(key, stringValue, { expirationTtl: secondsFromNow });
  } else {
    await kv.put(key, stringValue);
  }
};

const getData = async (kv: KVNamespace, key: string): Promise<any> => {
  const value = await kv.get(key, 'json');
  return value;
};

const updateData = async (kv: KVNamespace, key: string, newValue: any): Promise<void> => {
  await kv.put(key, JSON.stringify(newValue));
};

const deleteData = async (kv: KVNamespace, key: string): Promise<void> => {
  await kv.delete(key);
};

const getField = async (kv: KVNamespace, key: string, field: string): Promise<any> => {
  const data = await getData(kv, key);
  return data[field];
};

export const dbOperations = {
  putData,
  getData,
  updateData,
  deleteData,
  getField,
};
