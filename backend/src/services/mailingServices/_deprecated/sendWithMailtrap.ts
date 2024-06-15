//import { MailtrapClient } from 'mailtrap';


/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */

//const TOKEN = '373b5f609e279732f4d4830349333d27';
//const SENDER_EMAIL = 'viktor@beltorion.com';
//const RECIPIENT_EMAIL = 'viktor@beltorion.com';

//const client = new MailtrapClient({ token: TOKEN });
/*
async function sendEmailWithMailtrap() {
  //  SENDER_EMAIL: string,
  // RECIPIENT_EMAIL: string,
  //  subject: string,
  //  message: string
  const ENDPOINT = 'https://send.api.mailtrap.io/';

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });
  const sender = {
    email: 'mailtrap@demomailtrap.com',
    name: 'Mailtrap Test',
  };
  const recipients = [
    {
      email: 'viktor@beltorion.com',
    },
  ];

  client
    .send({
      from: sender,
      to: recipients,
      subject: 'You are awesome!',
      text: 'Congrats for sending test email with Mailtrap!',
      category: 'Integration Test',
    })
    .then(console.log, console.error);
}
*/
async function sendEmailWithMailtrapAPI() {
  //SENDER_EMAIL: string,
  // RECIPIENT_EMAIL: string,
  // subject: string,
  // message: string
  //const url: string = 'https://stoplight.io/mocks/railsware/mailtrap-api-docs/93404133/api/send';
  const url: string = 'https://api.mailtrap.io';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Api-Token': '373b5f609e279732f4d4830349333d27',
    },
    body: '{"to":[{"email":"viktor@beltorion.com"}],"cc":[{}],"bcc":[{}],"from":{"email":"mailtrap@demomailtrap.com","name":"Example Sales Team"},"attachments":[{"content":"PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L2JvZHk+Cgo8L2h0bWw+Cg==","filename":"index.html","type":"text/html","disposition":"attachment"}],"custom_variables":{"user_id":"45982","batch_id":"PSJ-12"},"headers":{"X-Message-Source":"dev.mydomain.com"},"subject":"Your Example Order Confirmation","text":"Congratulations on your order no. 1234","category":"API Test"}',
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export { sendEmailWithMailtrapAPI };
