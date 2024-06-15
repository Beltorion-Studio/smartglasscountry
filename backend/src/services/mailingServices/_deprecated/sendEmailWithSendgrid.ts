import sgMail from '@sendgrid/mail';

const API_KEY = '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';


async function sendEmailWithSendgrid(
  to: string,
  subject: string,
  //message: string,
  htmlContent: string
) {
  console.log('sendEmailWithSendgrid initialized');
  sgMail.setApiKey(API_KEY);

  const msg = {
    to: to,
    from: 'viktor@beltorion.com',
    subject: subject,
    //text: message,
    html: htmlContent,
  };

  try {
    console.log('Sending email...');
    const [response] = await sgMail.send(msg);
    console.log('Email sent successfully:', {
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.body,
    });
    return response.statusCode;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null) {
      console.error('Error sending email:', error);
      if ('response' in error) {
        console.error('Error response body:', error.response.body);
      }
    }
  }
}

export { sendEmailWithSendgrid };
