import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { authMiddleware } from '../middleware/jwtMiddleware';

const sample = new Hono<{ Bindings: Bindings }>();

sample.get('/', authMiddleware, async (c) => {
  try {
    const sampleData = {
      items: [
        { id: 1, name: 'Item 1', description: 'This is item 1' },
        { id: 2, name: 'Item 2', description: 'This is item 2' },
        { id: 3, name: 'Item 3', description: 'This is item 3' },
        { id: 4, name: 'Item 4', description: 'This is item 4' },
        { id: 5, name: 'Item 5', description: 'This is item 5' },
        { id: 6, name: 'Item 6', description: 'This is item 6' },
        { id: 7, name: 'Item 7', description: 'This is item 7' },
        { id: 8, name: 'Item 8', description: 'This is item 8' },
        { id: 9, name: 'Item 9', description: 'This is item 9' },
        { id: 10, name: 'Item 10', description: 'This is item 10' },
      ],
    };

    if (!sampleData) {
      return c.json({ error: 'Not found' }, { status: 404 });
    }
    return c.json(sampleData);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'An error occurred' }, { status: 500 });
  }
});

export { sample };
