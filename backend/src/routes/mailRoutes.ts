import { Hono } from 'hono';
import { Bindings } from 'hono/types';

import { buildOrderDetailsTemplate } from '../services/mailingServices/emailTemplates/orderDetailsTemplate';
import { sendEmail } from '../services/mailingServices/mailingService';

const mail = new Hono<{ Bindings: Bindings }>();
const API_KEY = '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';
const ESP_API_URL = 'https://api.sendgrid.com/v3/mail/send';

const orderDetails = {
  productType: 'Smart Glass',
  products: [
    {
      productType: 'Smart Glass',
      width: 100,
      height: 200,
      quantity: 2,
      size: 300,
      unitPrice: 200,
      unitOfMeasurement: 'inches',
    },
    {
      productType: 'Smart Glass',
      width: 150,
      height: 250,
      quantity: 1,
      size: 400,
      unitPrice: 200,
      unitOfMeasurement: 'inches',
    },
  ],
  totalRegularPrice: 350,
  shippingCost: 50,
  cratingCost: 25,
  insuranceCost: 10,
  subTotal: 435,
  discount: 25,
  totalFinalPrice: 410,
  quotedCurrency: 'USD',
  discountAmount: 25,
  tax: 10,
  unitOfMeasurement: 'inches',
  isNewOrder: false,
  discountPeriod: 4,
  minOrderQuantity: 2,
};

mail.post('/', async (c) => {
  const { recipientEmail, subject, message } = await c.req.json();
  console.log(recipientEmail, subject, message);
  const emailData = {
    from: {
      email: 'viktor@beltorion.com',
    },
    personalizations: [
      {
        to: [
          {
            email: recipientEmail,
          },
        ],
        subject: subject,
      },
    ],
    content: [
      {
        type: 'text/plain',
        value: message,
      },
    ],
  };

  const response = await fetch(ESP_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    console.error('Error sending email:', await response.text());
    return c.json({ message: 'Failed to send email.' }, 500);
  }

  console.log('Email sent successfully!');
  return c.json({ message: 'Email sent successfully!' }, 200);
});
mail.get('/', async (c) => {
  const senderEmail: string = 'viktor@email.beltorion.com';
  const recipientEmail: string = 'viktor.gazsi@gmail.com';
  const subject: string = 'Hello Viktor';
  const customerName: string = 'Viktor';
  const orderNumber: string = '123456789';
  const html = buildOrderDetailsTemplate(orderDetails, customerName, orderNumber);
  try {
    const response = await sendEmail(senderEmail, recipientEmail, subject, html);
    console.log(response);
    if (response) {
      return c.text('Mail sent successfully! Status code: 202');
    }
    return c.text('Mail failed to send. Status code: 500', 500);
  } catch (error) {
    console.error('Error in mail route:', error);
    return c.text('Error in mail route', 500);
  }
});

export { mail };
