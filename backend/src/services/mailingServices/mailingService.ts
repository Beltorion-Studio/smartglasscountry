import { FormData } from '../../types/types';
import { generateFormSubmissionEmail } from './emailTemplates/formSubmissionTemplate';
import { sendEmailWithResend } from './sendMailWithResend';

async function sendEmail(
  recipientEmail: string,
  customerSubject: string,
  companySubject: string,
  html: string,
  RESEND_API_KEY: string,
  COMPANY_EMAIL: string,
  DUPLICATE_EMAIL: string
): Promise<Response | void> {
  try {
    // Send email to the customer
    const customerResponse = await sendEmailWithResend(
      recipientEmail,
      customerSubject,
      html,
      RESEND_API_KEY
    );

    // Send email to the company and CC
    const companyResponse = await sendEmailWithResend(
      COMPANY_EMAIL,
      companySubject,
      html,
      RESEND_API_KEY,
      DUPLICATE_EMAIL
    );
    console.log('Company email response:', companyResponse);

    return customerResponse;
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

async function sendFormSubmissionEmail(
  formData: Omit<FormData, 'orderToken'>,
  RESEND_API_KEY: string
): Promise<Response | void> {
  const recipientEmail = 'info@smartglasscountry.com';
  const subject = 'New Calculator Form Submission';
  const html = generateFormSubmissionEmail(formData);
  const response = await sendEmailWithResend(recipientEmail, subject, html, RESEND_API_KEY);
  return response;
}
export { sendEmail, sendFormSubmissionEmail };
