import { OrderData, Product } from '../../../types/types';
const orderDetailsTemplateHead = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
      .table_component {
        text-align: left;
      }
      .table_header {
        height: 40px;
      }
      .table_cell {
        width: 80px;
        height: 28px;
      }
      .spacer-cell {
        width: 40px;
      }
    </style>
  </head>
`;

const templateBodyOpen = `
  <body>
  <div class="page-wrapper" style="padding: 50px; max-width: 800px">
`;

const orderDetailsTemplateHeader = `
  <p style="font-family: Arial, sans-serif; font-size: 18px; color: #333; line-height: 1.6">
    Hi [customerName],<br /><br />
    We noticed that you have some exciting items in your shopping cart at Smart Glass Country and wanted to remind you before you forget about them. Here's a quick summary of what's waiting for you:   
  </p>
  <h1 style="font-size: 40px; font-family: Arial, Helvetica, sans-serif">
    Review Your [productType] Order
  </h1>
`;

const productsContainerOpen = `
      <div class="product-container" style="padding: 20px; border: 10px solid #f1f2f3">
`;
const divider = `
  <div style="height: 20px; margin-bottom: 15px; width: 100%; border-bottom: 1px solid #f1f2f3">
  </div>
`;
const productsContainerClose = `</div>`;

const orderDetailsTableCalculations = `
<div
        style="
          padding: 20px;
          margin-top: 40px;
          border-bottom: 1px solid #f1f2f3;
          border-top: 1px solid #f1f2f3;
        "
      >
        <table>
          <tr>
            <td style="width: 300px; height: 32px; font-weight: 700">Regular Price:</td>
            <td style="font-weight: 700">[totalRegularPrice]</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px">Shipping cost :</td>
            <td>[shippingCost]</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px">Crating:</td>
            <td>[cratingCost]</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px">Insurance:</td>
            <td>[insuranceCost]</td>
          </tr>
        </table>
      </div>
      <div style="padding: 20px">
        <table>
          <tr>
            <td style="width: 300px; height: 32px; font-size: 18px; font-weight: 700">
              SUB TOTAL:
            </td>
            <td style="font-size: 18px; font-weight: 700">[subTotal]</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px; color: #dd8e40; font-size: 18px">
              [discount]% Online discount:
            </td>
            <td style="color: #dd8e40; font-size: 18px">[discountAmount]</td>
          </tr>
          <tr>
            <td
              style="width: 300px; height: 32px; font-size: 20px; color: #1274e0; font-weight: 700"
            >
              TOTAL AMOUNT:
            </td>
            <td style="font-size: 20px; color: #1274e0; font-weight: 700">[totalFinalPrice]</td>
          </tr>
        </table>
      </div>
`;

const endingText = `
  <p style="font-family: Arial, sans-serif; font-size: 18px; color: #333; line-height: 1.6">   
    Should you have any questions or need assistance, don't hesitate to reach us out at
    <a href="mailto:info@smartglasscountry.com" style="color: #007bff; text-decoration: none"
        >info@smartglasscountry.com</a
    >. We're here to help you customize your order to perfection.<br /><br />
    Thank you for choosing Smart Glass Coutnry. We look forward to creating your custom smart glass and smart film solutions.
  </p>
`;

const templateBodyClose = `
</div>
</body>
</html>
`;

function createProductRows(products: Product[], unitOfMeasurement: string): string {
  return products
    .map(
      (product, index) => `
          <table class="table_component">
            <thead class="table_head">
              <tr class="table_row">
                <th scope="col" colspan="6" class="table_header"><strong>${formatProductName(product.productType)}</strong></th>
              </tr>
            </thead>
            <tbody class="table_body">
              <tr class="table_row">
                <td class="table_cell">Width:</td>
                <td class="table_cell">${product.width} ${unitOfMeasurement}</td>
                <td class="table_cell spacer-cell"></td>
                <td class="table_cell"></td>
                <td class="table_cell"></td>
                <td class="table_cell"></td>
              </tr>
              <tr class="table_row">
                <td class="table_cell">Height:</td>
                <td class="table_cell">${product.height} ${unitOfMeasurement}</td>
                <td class="table_cell spacer-cell"></td>
                <td class="table_cell">Quantity:</td>
                <td class="table_cell">${product.quantity} pcs</td>
                <td class="table_cell"></td>
              </tr>
              <tr class="table_row">
                <td class="table_cell">Size:</td>
                <td class="table_cell">${product.size} ${
                  product.unitOfMeasurement === 'inches' ? 'SQFT' : 'SQMT'
                }</td>
                <td class="table_cell spacer-cell"></td>
                <td class="table_cell"><strong>$${product.totalPrice.toFixed(2)}</strong></td>
                <td class="table_cell"></td>
                <td class="table_cell"></td>
              </tr>
            </tbody>
          </table>
          ${index < products.length - 1 ? divider : ''}
        `
    )
    .join('');
}

function buildOrderDetailsTemplate(orderDetails: OrderData, customerName: string): string {
  const {
    productType,
    products,
    totalRegularPrice,
    shippingCost,
    cratingCost,
    insuranceCost,
    subTotal,
    discount,
    totalFinalPrice,
    discountAmount,
    unitOfMeasurement,
  } = orderDetails;

  const productRows = createProductRows(products, unitOfMeasurement);

  // Select the appropriate template header based on isDeposit

  // Assemble the template
  const template = `
        ${orderDetailsTemplateHead}
        ${templateBodyOpen}
        ${orderDetailsTemplateHeader
          .replace('[productType]', formatProductName(productType))
          .replace('[customerName]', customerName)}
        ${productsContainerOpen}
            ${productRows}   
        ${productsContainerClose}
        ${orderDetailsTableCalculations
          .replace('[totalRegularPrice]', `$${totalRegularPrice.toFixed(2)}`)
          .replace('[shippingCost]', `$${shippingCost.toFixed(2)}`)
          .replace('[cratingCost]', `$${cratingCost.toFixed(2)}`)
          .replace('[insuranceCost]', `$${insuranceCost.toFixed(2)}`)
          .replace('[subTotal]', `$${subTotal.toFixed(2)}`)
          .replace('[discount]', `${discount}`)
          .replace('[discountAmount]', `-$${discountAmount.toFixed(2)}`)
          .replace('[totalFinalPrice]', `$${totalFinalPrice.toFixed(2)}`)
          .replace('[unitOfMeasurement]', `${unitOfMeasurement}`)}
          ${endingText}
        ${templateBodyClose}
      `;

  // Replace additional values if isDeposit is true

  return template;
}

function formatProductName(productType: string): string {
  if (productType === 'smartGlass') {
    return 'Smart Glass';
  }
  if (productType === 'smartFilm') {
    return 'Smart Film';
  }
  return 'IGU';
}
export { buildOrderDetailsTemplate };
