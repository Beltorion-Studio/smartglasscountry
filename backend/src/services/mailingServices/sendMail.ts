//import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
const API_KEY = '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';
//const API_KEY = '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';
async function sendEmail(to: string, subject: string, htmlContent: string) {
  console.log('sendEmail initialized');

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject,
        },
      ],
      from: {
        email: 'viktor@beltorion.com',
        name: 'Viktor',
      },
      content: [
        {
          type: 'text/html',
          value: htmlContent,
        },
      ],
    }),
  });

  console.log('Response status:', response.status);
  console.log('Response status text:', response.statusText);

  if (response.ok) {
    try {
      const responseData = await response.json();
      console.log('Message sent:', responseData);
    } catch (error) {
      console.log('Response is not in JSON format.');
    }
  } else {
    try {
      const errorData = await response.json();
      console.error('Error sending email:', errorData);
    } catch (error) {
      console.error('Error sending email, and the response is not in JSON format.');
    }
  }
}

async function sendEmailWithSendgrid(to: string, subject: string, message: string) {
  console.log('sendEmailWithSendgrid initialized');
  sgMail.setApiKey(API_KEY);

  const msg = {
    to: to,
    from: 'viktor@beltorion.com',
    subject: subject,
    text: message,
    html: `<strong>${message}</strong>`,
  };

  try {
    console.log('Sending email...');
    const [response] = await sgMail.send(msg);
    console.log('Email sent successfully:', {
      statusCode: response.statusCode,
      headers: response.headers,
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null) {
      console.error('Error sending email:', error);
      if ('response' in error) {
        console.error('Error response body:', error.response.body);
      }
    }
  }
}

export { sendEmail, sendEmailWithSendgrid };
