import { sendEmailWithSendgrid } from './sendMail';

async function initailazeMailingService() {
  try {
    await sendEmailWithSendgrid('viktor.gazsi@gmail.com', 'Hello3', 'Hello world?');
    console.log('Mailing service initialized successfully');
  } catch (error) {
    console.error('Error initializing mailing service:', error);
  }
}
export { initailazeMailingService };
