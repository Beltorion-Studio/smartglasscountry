import { sendEmailWithResend } from './sendMailWithResend';

async function sendEmail(
  senderEmail: string,
  recipientEmail: string,
  subject: string,
  html: string,
  RESEND_API_KEY: string
): Promise<Response | void> {
  try {
    const response = await sendEmailWithResend(
      senderEmail,
      recipientEmail,
      subject,
      html,
      RESEND_API_KEY
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error initializing mailing service:', error);
  }
}
export { sendEmail };
