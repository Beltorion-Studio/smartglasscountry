import { Hono } from 'hono';
import { ZodError } from 'zod';

import { formSchema } from '../models/contactFormSchema';
import { insertFormData, insertOrder } from '../services/D1DatabaseOperations';
import sanitizeData from '../services/sanitizeData';
import { getSession } from '../services/session';
import { Bindings } from '../types/types';
import { FormData, OrderData, Payload, Product } from '../types/types';
const form = new Hono<{ Bindings: Bindings }>();

form.post('/', async (c) => {
  try {
    const form = await c.req.json();
    const sanitizedForm = sanitizeData(form) as FormData;

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
    const order = (await getSession(c, sanitizedForm.orderToken)) as OrderData;
    console.log(order);
    const payload = generateSalesforcePayload(sanitizedForm, order);
    console.log(payload);

    const insertFormToDb = await insertFormData(c.env.DB, sanitizedForm);
    console.log(insertFormToDb);
    if (!insertFormToDb.success) {
      throw new Error('Failed to insert form data into the database');
    }
    const { lastRowId } = insertFormToDb;
    const insertOrderToDbSuccess = await insertOrder(
      c.env.DB,
      order,
      lastRowId,
      sanitizedForm.orderToken
    );

    if (!insertOrderToDbSuccess) {
      throw new Error('Failed to insert Order data into the database');
    }
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

function calculateTotalSqft(products: Product[]): number {
  const totalsqft = products.reduce(
    (acc, { squareFootage, quantity }) => acc + squareFootage * quantity,
    0
  );
  return parseFloat(totalsqft.toFixed(2));
}

function generateSalesforcePayload(formData: FormData, orderData: OrderData): Payload {
  const payload: Payload = {
    [formData.orderToken]: {
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
        products: orderData.products.map(({ width, height, quantity }) => ({
          width,
          height,
          quantity,
        })),
        productType: orderData.productType,
        totalsqft: calculateTotalSqft(orderData.products),
        totalRegularPrice: parseFloat(orderData.totalRegularPrice.toFixed(2)),
      },
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
function sendOrderDetailsEmail(order: OrderData, orderToken: any, arg2: boolean, DB: D1Database) {
  throw new Error('Function not implemented.');
}
