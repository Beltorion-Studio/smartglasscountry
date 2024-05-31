import { Hono } from 'hono';
import { Bindings } from 'hono/types';
import { ZodError } from 'zod';

import { formSchema } from '../models/contactFormSchema';
import { sanitizeData } from '../services/sanitizeData';
import { getSession } from '../services/session';
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
    const order = await getSession(c, sanitizedForm.orderToken as string);
    console.log(order);

    // send form data to salesforce api
    //await sendFormToSalesforce(sanitizedForm);

    return c.json({
      success: true,
      status: 200,
      sanitizedForm: sanitizedForm,
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

function generateSalesforcePayload(
  formData: { [key: string]: string },
  orderData: {
    products: Array<{
      width: number;
      height: number;
      quantity: number;
      productType: string;
      squareFootage: number;
      totalPrice: number;
    }>;
    totalRegularPrice: number;
    productType: string;
  }
) {
  const payload = {
    formData: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType,
      roleInProject: formData.roleInProject,
      location: formData.location,
      country: formData.country,
      state: formData.state,
    },
    orderDetails: {
      products: orderData.products.map((product) => ({
        width: product.width,
        height: product.height,
        quantity: product.quantity,
      })),
      productType: orderData.productType,
      totalsqft: orderData.products.reduce(
        (acc, product) => acc + product.squareFootage * product.quantity,
        0
      ),
      totalPrice: orderData.totalRegularPrice,
    },
  };

  return payload;
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
