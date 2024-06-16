import { Hono } from 'hono';

import { insertFormData, insertUser } from '../services/D1DatabaseOperations';
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
  //const { slug } = c.req.param();
  //const { author, body } = await c.req.json();

  //if (!author) return c.text('Missing author value for new comment');
  //if (!body) return c.text('Missing body value for new comment');
  console.log('inserting data');
  const { success } = await c.env.DB.prepare(
    `
      insert into users (user_name, email, phone, project_type, role_in_project, user_location, country, order_token, state_or_province) values ('Michael Jackson', 'Michael@example.com', '1234567890', 'Construction', 'Manager', 'New York', 'USA', 'token1768', 'Active')
    `
  )
    //.bind(author, body, slug)
    .run();

  if (success) {
    c.status(201);
    return c.text('Created');
  }
  c.status(500);
  return c.text('Something went wrong');
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
