import { getCookie } from 'hono/cookie';
import { ZodError } from 'zod';

import { formSchema } from '../models/contactFormSchema';
import { sanitizeData } from '../services/sanitizeData';

async function validateForm(c) {
  try {
    const allCookies = getCookie(c);
    console.log(allCookies);
    const form = await c.req.json();
    const sanitizedForm = sanitizeData(form);

    console.log(form);
    const { error } = validateFormData(sanitizedForm);
    if (error) {
      return c.json({ errors: error.issues }, { status: 400 });
    }

    return c.json({
      success: true,
      status: 200,
      redirectUrl: 'https://smartglass.webflow.io/product-detail',
    });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

export { validateForm };
