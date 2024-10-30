import { Resend } from 'resend';

async function sendEmailWithResend(
  TO_RECIPIENT: string,
  subject: string,
  html: string,
  RESEND_API_KEY: string
) {
  if (!RESEND_API_KEY) {
    return new Response('RESEND_API_KEY environment variable is not defined', { status: 500 });
  }
  const SENDER_EMAIL: string = 'info@mail2.smartglasscountry.com';

  const resend = new Resend(RESEND_API_KEY);

  const data = await resend.emails.send({
    from: SENDER_EMAIL,
    to: TO_RECIPIENT,
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
