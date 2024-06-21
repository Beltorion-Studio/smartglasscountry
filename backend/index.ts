import { sendRemainderEmail } from './src/services/sendreminderEmail';
import app from './src/worker';

export interface Env {
  KV: KVNamespace;
  BW: Fetcher;
  URL: string;
  DB: D1Database;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('scheduled');
    const result = await sendRemainderEmail(env);

    console.log('scheduled result', result);
  },

  async fetch(request: Request, env: any): Promise<Response> {
    return await app.fetch(request, env);
  },
};
