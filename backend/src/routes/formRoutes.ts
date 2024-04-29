import { Hono } from 'hono';
import { Bindings } from 'hono/types';
import { ZodError } from 'zod';

import { formSchema } from '../models/contactFormSchema';
import { sanitizeData } from '../services/sanitizeData';
const form = new Hono<{ Bindings: Bindings }>();

form.post('/', async (c) => {
  try {
    const form = await c.req.json();
    const sanitizedForm = sanitizeData(form);

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
    console.log(sanitizedForm);
    // send form data to salesforce api
    //await sendFormToSalesforce(sanitizedForm);

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
    return { data: null, error: parsedData.error };
  }

  return { data: parsedData.data, error: null };
}
/*
async function sendFormToSalesforce(formData: { [key: string]: string }) {
  // Call salesforce API to send form data
  const response = await salesforce.post('/forms', formData);

  if(response.status !== 200) {
    throw new Error('Error sending form data to salesforce');
  }
}
*/
/*
async function salesforce({ env }: { env: Bindings['env'] }) {
  const client = new Client({
    instanceUrl: env.SALESFORCE_INSTANCE_URL,
    clientId: env.SALESFORCE_CLIENT_
    ID,
    clientSecret: env.SALESFORCE_CLIENT_SECRET,
    redirectUri: env.SALESFORCE_REDIRECT_URI,
  });
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
*/

export { form };
