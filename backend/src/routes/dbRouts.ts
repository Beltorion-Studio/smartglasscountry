import { Hono } from 'hono';

import { insertFormData } from '../services/D1DatabaseOperations';
//import { Bindings } from 'hono/types';
type Bindings = {
  DB: D1Database;
};
const db = new Hono<{ Bindings: Bindings }>();
export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database;
}

db.get('/:id', async (c) => {
  const userId = c.req.param('id');
  console.log('inserting data');

  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM users')
      //.bind(userId)
      .all();
    return c.json(results);
  } catch (e) {
    return c.json({ err: e.message }, 500);
  }
});

db.get('/', async (c) => {
  console.log('Getting all users');
  try {
    //const { results } = await c.env.DB.prepare('SELECT * FROM users').all();
    const { results } = await c.env.DB.prepare(
      `
    SELECT
        u.user_name,
        u.email,
        o.order_id,
        o.total_final_price,
        dod.discount_period_expiry,
        dod.order_token
    FROM
        deposit_order_details dod
        JOIN
        orders o ON dod.order_token = o.order_token
        JOIN
        users u ON o.user_id = u.user_id
    WHERE
        dod.discount_period_expiry >= DATETIME('now')
        AND dod.discount_period_expiry < DATETIME('now', '+1 day')
        AND o.created_at > DATETIME('now', '-1 day')        
        AND dod.is_reminder_sent = FALSE;
    `
    ).all();
    console.log('results', results);
    return c.json(results);
  } catch (e) {
    return c.json({ err: e.message }, 500);
  }
});

db.post('/', async (c) => {
  const user = {
    name: 'Jane Doe',
    email: 'john5@gmail.com',
    phone: '12365474',
    projectType: 'office',
    roleInProject: 'homeowner',
    location: 'usaCanada',
    country: 'usa',
    state: 'arkansas',
    orderToken: 'ert248-5f9c-4547-9042-c401549c24cb',
  };

  const dbSuccess = await insertFormData(c.env.DB, user);
  if (!dbSuccess) {
    throw new Error('Failed to insert form data into the database');
  }

  return c.json({
    success: true,
    status: 200,
    user: user,
  });
});

export { db };

/*
`
SELECT u.user_name, u.email
FROM orders o
JOIN users u ON o.user_id = u.user_id
WHERE DATE(o.created_at, '+' || CAST(o.discount_period AS TEXT) || ' days')
BETWEEN DATE('now', '+1 day') AND DATE('now', '+2 days');
`
*/
