import { sendEmailWithResend } from './sendMailWithResend';

async function initailazeMailingService(
  senderEmail: string,
  recipientEmail: string,
  subject: string,
  html: string
): Promise<Response | void> {
  try {
    const response = await sendEmailWithResend(senderEmail, recipientEmail, subject, html);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error initializing mailing service:', error);
  }
}
export { initailazeMailingService };
