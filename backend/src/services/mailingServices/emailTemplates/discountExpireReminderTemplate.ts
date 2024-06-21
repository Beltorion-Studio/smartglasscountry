import { calculateRemainingBalanceAfterDeposit } from '../templateUtils';

// Template
const discountExpireReminderTemplate = `
<!DOCTYPE html>
<html>
<body>
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Dear [userName],</p>

        <p>We hope this message finds you well. This is a friendly reminder that your discount period for your order #[orderNumber] with Smart Glass Country is about to expire on <strong>[expireDate]</strong>.</p>

        <p>To ensure you don't lose your discount, please pay the remaining balance of <strong>$[remainingBalanceAfterDeposit]</strong> as soon as possible.</p>

        <p>Thanks again for shopping with us!</p>

        <p>Best regards,<br />
        Dmitri<br />
        Smart Glass Country</p>
    </div>
</body>
</html>
`;

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
// Function to replace the fields in the template
function generateDiscountExpireReminderEmail(
  userName: string,
  orderNumber: string,
  totalFinalPrice: number,
  expireDate: string
): string {
  const remainingBalanceAfterDeposit = calculateRemainingBalanceAfterDeposit(500, totalFinalPrice);
  const formattedExpireDate = formatDate(expireDate);

  return discountExpireReminderTemplate
    .replace('[userName]', userName)
    .replace('[orderNumber]', orderNumber)
    .replace('[expireDate]', formattedExpireDate)
    .replace('[remainingBalanceAfterDeposit]', remainingBalanceAfterDeposit);
}

export { generateDiscountExpireReminderEmail };
