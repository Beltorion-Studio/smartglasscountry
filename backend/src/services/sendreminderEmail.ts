import { Bindings } from '../types/types';
import { generateDiscountExpireReminderEmail } from './mailingServices/emailTemplates/discountExpireReminderTemplate';
import { sendEmail } from './mailingServices/mailingService';
type ExpiringOrders = {
  user_name: string;
  email: string;
  order_id: number;
  total_final_price: number;
  discount_period_expiry: string;
  order_token: string;
};

async function sendRemainderEmail(env: Bindings): Promise<void> {
  const expiringOrders = (await queryExpiringOrders(env)) as ExpiringOrders[];
  console.log('expiringOrders', expiringOrders);
  if (!expiringOrders) {
    return;
  }

  const formatOrderNumber = (orderId: number): string => {
    return orderId.toString().padStart(7, '0');
  };

  for (const order of expiringOrders) {
    const orderNumber = formatOrderNumber(order.order_id);

    const senderEmail: string = 'sergiu@smartglasscountry.com';
    const recipientEmail: string = order.email;
    const customerName: string = order.user_name;
    const subjectText: string = `Hello ${customerName}, your order with order id #${orderNumber} will expire soon.`;
    const emailTemplate = generateDiscountExpireReminderEmail(
      customerName,
      orderNumber,
      order.total_final_price,
      order.discount_period_expiry
    );

    const response = await sendEmail(senderEmail, recipientEmail, subjectText, emailTemplate);
    if (!response) {
      console.error(`Failed to send email to ${recipientEmail}`);
    } else {
      console.log(`Successfully sent email to ${recipientEmail}`);
      const response = await setReminderSentToTrue(env, order.order_token);
      if (!response) {
        console.error(`Failed to update reminder_sent to true for order id ${order.order_id}`);
      }
    }
  }
}

async function queryExpiringOrders(env: Bindings): Promise<ExpiringOrders[] | undefined> {
  try {
    const { DB } = env;
    const { results } = await DB.prepare(
      `
    SELECT
        u.user_name,
        u.email,
        o.order_id,
        o.total_final_price,
        dod.discount_period_expiry,
        dod.order_token
    FROM
        deposit_order_details dod
        JOIN
        orders o ON dod.order_token = o.order_token
        JOIN
        users u ON o.user_id = u.user_id
    WHERE
        dod.discount_period_expiry >= DATETIME('now')
        AND dod.discount_period_expiry < DATETIME('now', '+1 day')
        AND o.created_at > DATETIME('now', '-1 day')        
        AND dod.is_reminder_sent = FALSE;
    `
    ).all();
    return results as ExpiringOrders[];
  } catch (error) {
    console.error('Something went wrong', error);
    throw error;
  }
}

async function setReminderSentToTrue(env: Bindings, order_token: string): Promise<boolean> {
  try {
    const { DB } = env;
    const updateQuery = `UPDATE deposit_order_details
       SET is_reminder_sent = 1
       WHERE order_token = ?;`;

    await DB.prepare(updateQuery).bind(order_token).run();

    console.log('Reminders have been marked as sent for order IDs:', order_token);
    return true;
  } catch (error) {
    console.error('Failed to update reminders for order IDs', error);
    throw error;
  }
}

export { sendRemainderEmail };
