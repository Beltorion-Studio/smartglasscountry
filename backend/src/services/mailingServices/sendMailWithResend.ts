import { Resend } from 'resend';

//const resend = new Resend('re_dYyTJH7o_G2gmpyuTjHZysFpRfBggyZnr');
const resend = new Resend('re_Fd9HBa49_5AJ6MUnqP455CmZ4mhyaoyp3');
async function sendEmailWithResend(
  SENDER_EMAIL: string,
  RECIPIENT_EMAIL: string,
  subject: string,
  html: string
) {
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
