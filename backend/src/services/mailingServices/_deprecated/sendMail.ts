//import * as nodemailer from 'nodemailer';
//const API_KEY = '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';
//const API_KEY = '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';
const API_KEY = '188e1122f94d6edd36afe8fed8b38159-51356527-0cdbf9dc'; //mailGun API key
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

export { sendEmail };
