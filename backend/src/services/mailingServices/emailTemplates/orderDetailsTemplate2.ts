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
const TemplateBodyOpen = `
  <body>
  <div class="page-wrapper" style="padding: 50px; max-width: 800px">
`;

const TemplateBodyClose = `
</div>
</body>
`;
const orderDetailsTemplateHeader = `
  <h1 style="font-size: 40px; font-family: Arial, Helvetica, sans-serif">
    Review Your {productType} Order
  </h1>
`;

const productsContainerOpen = `
      <div class="product-container" style="padding: 20px; border: 10px solid #f1f2f3">
`;

const productsContainerClose = `</div>`;

const productsTable = `
   <table class="table_component">
          <thead class="table_head">
            <tr class="table_row">
              <th scope="col" colspan="6" class="table_header"><strong>{productType}</strong></th>
            </tr>
          </thead>
          <tbody class="table_body">
            <tr class="table_row">
              <td class="table_cell">Width:</td>
              <td class="table_cell">0</td>
              <td class="table_cell spacer-cell"></td>
              <td class="table_cell"></td>
              <td class="table_cell"></td>
              <td class="table_cell"></td>
            </tr>
            <tr class="table_row">
              <td class="table_cell">Height:</td>
              <td class="table_cell">0</td>
              <td class="table_cell spacer-cell"></td>
              <td class="table_cell">Quantity:</td>
              <td class="table_cell">10 pcs</td>
              <td class="table_cell"></td>
            </tr>
            <tr class="table_row">
              <td class="table_cell">Size:</td>
              <td class="table_cell">0</td>
              <td class="table_cell spacer-cell"></td>
              <td class="table_cell"><strong>$100</strong></td>
              <td class="table_cell"></td>
              <td class="table_cell"></td>
            </tr>
          </tbody>
    </table>
`;
const divider = `
  <div style="height: 20px; margin-bottom: 15px; width: 100%; border-bottom: 1px solid #f1f2f3">
  </div>
`;

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
            <td style="font-weight: 700">$100</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px">Shipping cost :</td>
            <td>$100</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px">Crating:</td>
            <td>$100</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px">Insurance:</td>
            <td>$100</td>
          </tr>
        </table>
      </div>
      <div style="padding: 20px">
        <table>
          <tr>
            <td style="width: 300px; height: 32px; font-size: 18px; font-weight: 700">
              SUB TOTAL:
            </td>
            <td style="font-size: 18px; font-weight: 700">$100</td>
          </tr>
          <tr>
            <td style="width: 300px; height: 32px; color: #dd8e40; font-size: 18px">
              25% Online discount:
            </td>
            <td style="color: #dd8e40; font-size: 18px">$100</td>
          </tr>
          <tr>
            <td
              style="width: 300px; height: 32px; font-size: 20px; color: #1274e0; font-weight: 700"
            >
              TOTAL AMOUNT:
            </td>
            <td style="font-size: 20px; color: #1274e0; font-weight: 700">$100</td>
          </tr>
        </table>
      </div>
`;
export const orderDetailsTemplate = ``;