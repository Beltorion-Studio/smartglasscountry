export const orderDetailsTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />
    <title>Document</title>
  </head>
  <body>
    <div class="sg-container">
      <div class="review-ttl-w">
        <h2 class="sg-ttl-2 mb-0">
          Review Your
          <span data-order-details="productType" class="order-title">Smart Film</span> Order
        </h2>
        <div class="logo-img-w">
          <img
            src="https://cdn.prod.website-files.com/5890c652e9e81e0a4714186c/5892d7b7bf512eec3e7b0ca7_Logo.webp"
            loading="lazy"
            alt=""
            class="logo-in-w"
          />
        </div>
      </div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: Arial, sans-serif;">
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <!-- First Order Card -->
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <!-- Product Details Left Column -->
                      <td valign="top" width="50%">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td>
                              <div class="product-details-left">
                                <div data-order="productType" class="sg-order-text order-description">
                                  Item description
                                </div>
                                <!-- Width Line -->
                                <div class="product-details-line" style="display: flex; gap: 8px">
                                  <div class="sg-order-text">Width:</div>
                                  <div data-order="width" class="sg-order-text">0</div>
                                </div>
                                <!-- Height Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Height:</div>
                                  <div data-order="height" class="sg-order-text">0</div>
                                </div>
                                <!-- Size Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Size:</div>
                                  <div data-order="size" class="sg-order-text">0</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <!-- Product Details Right Column -->
                      <td valign="top" width="50%">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td>
                              <div class="product-details-right">
                                <!-- Quantity Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Quantity:</div>
                                  <div data-order="quantity" class="sg-order-text">$0</div>
                                </div>
                                <!-- Total Price Line -->
                                <div class="product-details-total">
                                  <div class="sg-order-text bold">Total:</div>
                                  <div data-order="totalPrice" class="sg-order-text bold">$0</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Second Order Card -->
              <tr>
                <td style="padding-top: 20px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <!-- Product Details Left Column -->
                      <td valign="top" width="50%">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td>
                              <div class="product-details-left">
                                <div data-order="productType" class="sg-order-text order-description">
                                  Item description
                                </div>
                                <!-- Width Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Width:</div>
                                  <div data-order="width" class="sg-order-text">0</div>
                                </div>
                                <!-- Height Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Height:</div>
                                  <div data-order="height" class="sg-order-text">0</div>
                                </div>
                                <!-- Size Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Size:</div>
                                  <div data-order="size" class="sg-order-text">0</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <!-- Product Details Right Column -->
                      <td valign="top" width="50%">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td>
                              <div class="product-details-right">
                                <!-- Quantity Line -->
                                <div class="product-details-line">
                                  <div class="sg-order-text">Quantity:</div>
                                  <div data-order="quantity" class="sg-order-text">$0</div>
                                </div>
                                <!-- Total Price Line -->
                                <div class="product-details-total">
                                  <div class="sg-order-text bold">Total:</div>
                                  <div data-order="totalPrice" class="sg-order-text bold">$0</div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div bo-elements="orderContainer" class="order-review-mobile">
        <div id="orderRowsContainer" bo-elements="orderRowsContainer" class="order-cards-w"></div>
        <div class="order-details">
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="sg-order-text bold">Regular price</div>
            </div>
            <div class="order-total">
              <div data-order-details="totalRegularPrice" class="order-total-price">$0.00</div>
            </div>
          </div>
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="sg-order-text">Shipping cost</div>
            </div>
            <div class="order-total">
              <div data-order-details="shippingCost" class="order-total-price">$0.00</div>
            </div>
          </div>
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="sg-order-text">Crating</div>
            </div>
            <div class="order-total">
              <div data-order-details="cratingCost" class="order-total-price">$0.00</div>
            </div>
          </div>
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="sg-order-text">Insurance</div>
            </div>
            <div class="order-total">
              <div data-order-details="insuranceCost" class="order-total-price">$0.00</div>
            </div>
          </div>
          <div class="sg-line"></div>
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="sg-order-text bold">SUB TOTAL</div>
            </div>
            <div class="order-total">
              <div data-order-details="subTotal" class="order-total-price">$0.00</div>
            </div>
          </div>
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="order-total-text discount">
                <code data-order-details="discount" class="discount">0</code>% Online discount
              </div>
            </div>
            <div class="order-total">
              <div data-order-details="discountAmount" class="order-total-price discount">
                -$0.00
              </div>
            </div>
          </div>
          <div class="order-result-row mobile">
            <div class="order-total">
              <div class="order-total-text total-amount">Total amount</div>
            </div>
            <div class="order-total">
              <div data-order-details="totalFinalPrice" class="order-total-price total-amount">
                $0.00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transactional Email</title>
    <style>
        /* Reset styles for consistency */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        /* Responsive email styles */
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div class="container" style="max-width: 600px; margin: auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">Thank You for Your Interest!</h1>
        <p style="text-align: justify;">
            Dear Viktor,<br><br>
            Thank you for your interest in our services. We appreciate your inquiry and look forward to assisting you.<br><br>
            Please feel free to contact us if you have any questions or need further information.<br><br>
            Best regards,<br>
            beltorion.com
        </p>
        <p style="text-align: center; font-size: 0.8em; color: #999;">
            This is a transactional email. You received this email because you expressed interest in our services.
        </p>
    </div>
</body>
</html>
`;
