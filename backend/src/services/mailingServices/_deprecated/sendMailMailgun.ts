import * as FormData from 'form-data';
//import Mailgun, { MailgunClientOptions, MessagesSendResult } from 'mailgun.js';

const API_KEY = '188e1122f94d6edd36afe8fed8b38159-51356527-0cdbf9dc'; //mailGun API key

/*
async function sendEmailWithMailgun(
  to: string,
  subject: string,
  textContent: string,
  htmlContent: string
) {
  console.log('sendEmail initialized');
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: 'api',
    key: API_KEY,
  });

  try {
    const msg = await mg.messages.create('viktor@beltorion.com', {
      from: 'Viktor Gazsi <viktor@beltorion.com>',
      to: [to],
      subject: subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(msg);
  } catch (err) {
    console.error(err);
  }
}
*/
async function sendEmailWithMailgun2(
  to: string,
  subject: string,
  textContent: string,
  htmlContent: string
) {
  console.log('sendEmail initialized');

  const url = `https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages`;
  const apiKey = btoa(`api:${API_KEY}`);

  const formData = new URLSearchParams();
  formData.append('from', 'Viktor Gazsi <viktor@beltorion.com>');
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('text', textContent);
  formData.append('html', htmlContent);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const result = await response.json();
    console.log(result); 
  } catch (err) {
    console.error(err); 
  }
}

export { sendEmailWithMailgun, sendEmailWithMailgun2 };
