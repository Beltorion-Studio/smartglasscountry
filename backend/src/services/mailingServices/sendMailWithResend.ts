import { Resend } from 'resend';

async function sendEmailWithResend(
  SENDER_EMAIL: string,
  RECIPIENT_EMAIL: string,
  subject: string,
  html: string,
  RESEND_API_KEY: string
) {
  console.log('sending EmailWithResend');
  console.log('RESEND_API_KEY', RESEND_API_KEY);
  if (!RESEND_API_KEY) {
    return new Response('RESEND_API_KEY environment variable is not defined', { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);

  const data = await resend.emails.send({
    from: SENDER_EMAIL,
    to: RECIPIENT_EMAIL,
    subject: subject,
    html: html,
  });

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export { sendEmailWithResend };
