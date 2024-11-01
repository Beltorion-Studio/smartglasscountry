import { Hono } from 'hono';
import { ZodError } from 'zod';

import { formSchema } from '../models/contactFormSchema';
import { insertFormData, insertOrder } from '../services/D1DatabaseOperations';
import { sendFormSubmissionEmail } from '../services/mailingServices/mailingService';
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
      redirectUrl = 'https://smartglasscountry.com/product-detail?country=true';
    } else {
      redirectUrl = 'https://smartglasscountry.com/product-detail?country=false';
    }
    const order = (await getSession(c, sanitizedForm.orderToken)) as OrderData;
    console.log('order', order);
    const payload = await generateSalesforcePayload(sanitizedForm, order);
    console.log('formData', payload[sanitizedForm.orderToken].formData);

    const insertFormToDb = await insertFormData(c.env.DB, sanitizedForm);
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
    const { formData } = payload[sanitizedForm.orderToken];
    await sendFormSubmissionEmail(formData, c.env.RESEND_API_KEY);

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

async function generateSalesforcePayload(
  formData: FormData,
  orderData: OrderData
): Promise<Payload> {
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
