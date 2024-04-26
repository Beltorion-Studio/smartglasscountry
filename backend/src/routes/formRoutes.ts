import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { Bindings } from 'hono/types';
import { ZodError } from 'zod';

import { formSchema } from '../models/contactFormSchema';
import { sanitizeData } from '../services/sanitizeData';
const form = new Hono<{ Bindings: Bindings }>();

form.post('/', async (c) => {
  try {
    const allCookies = getCookie(c);
    console.log(allCookies);
    const form = await c.req.json();
    const sanitizedForm = sanitizeData(form);

    console.log(form.location);
    const { error } = validateFormData(sanitizedForm);
    if (error) {
      return c.json({ errors: error.issues }, { status: 400 });
    }
    const { location } = sanitizedForm;
    let redirectUrl;
    if (location === 'usaCanada') {
      redirectUrl = 'https://smartglass.webflow.io/product-detail?country=true';
    } else {
      redirectUrl = 'https://smartglass.webflow.io/product-detail?country=false';
    }

    return c.json({
      success: true,
      status: 200,
      redirectUrl: redirectUrl,
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Internal server error' }, { status: 500 });
  }
});

function validateFormData(data: { [key: string]: string }): {
  data: { [key: string]: string } | null;
  error: ZodError | null;
} {
  const parsedData = formSchema.safeParse(data);

  if (!parsedData.success) {
    // If the parsing failed, return the error object
    return { data: null, error: parsedData.error };
  }

  // If the parsing was successful, return the parsed data with no error
  return { data: parsedData.data, error: null };
}

export { form };
