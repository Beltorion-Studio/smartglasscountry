import { FormData, OrderData } from '../types/types';

// Function to insert an order into the database
async function insertOrder(
  DB: D1Database,
  OrderData: OrderData,
  userId: number,
  orderToken: string
): Promise<boolean> {
  const insertOrderQuery = `
  INSERT INTO orders (
    order_token, user_id, total_regular_price, discount_amount, total_final_price, 
    quoted_currency, crating_cost, insurance_cost, tax, shipping_cost, sub_total, 
    min_order_quantity, discount, is_usa_or_canada, 
    unit_of_measurement, is_deposit_order
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

  const orderValues = [
    orderToken,
    userId,
    OrderData.totalRegularPrice,
    OrderData.discountAmount,
    OrderData.totalFinalPrice,
    OrderData.quotedCurrency,
    OrderData.cratingCost,
    OrderData.insuranceCost,
    OrderData.tax,
    OrderData.shippingCost,
    OrderData.subTotal,
    OrderData.minOrderQuantity,
    OrderData.discount,
    OrderData.isUsaOrCanada || false,
    OrderData.unitOfMeasurement,
    false, // is deposit order
  ];

  try {
    await DB.prepare(insertOrderQuery)
      .bind(...orderValues)
      .run();

    const insertOrderProductQuery = `
        INSERT INTO order_products (
          order_token, width, height, quantity, product_type, square_footage, square_meterage, 
          product_size, total_price, unit_price, insurance_percentage, shipping_cost, unit_of_measurement
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

    for (const product of OrderData.products) {
      const productValues = [
        orderToken,
        product.width,
        product.height,
        product.quantity,
        product.productType,
        product.squareFootage,
        product.squarMeterage,
        product.size,
        product.totalPrice,
        product.unitPrice,
        product.insurancePercentage,
        product.shippingCost,
        product.unitOfMeasurement,
      ];

      await DB.prepare(insertOrderProductQuery)
        .bind(...productValues)
        .run();
    }

    return true;
  } catch (error) {
    console.error('Error inserting order data into the database:', error);
    return false;
  }
}

async function updateOrder(
  DB: D1Database,
  OrderData: OrderData,
  orderToken: string,
  isDepositOrder?: boolean
): Promise<boolean> {
  const updateOrderQuery = `
    UPDATE orders
    SET total_regular_price = ?, discount_amount = ?, total_final_price = ?, 
        quoted_currency = ?, crating_cost = ?, insurance_cost = ?, tax = ?, 
        shipping_cost = ?, sub_total = ?, min_order_quantity = ?, discount = ?, 
        is_deposit_order = ?, is_usa_or_canada = ?, unit_of_measurement = ?
    WHERE order_token = ?;
  `;

  const orderValues = [
    OrderData.totalRegularPrice,
    OrderData.discountAmount,
    OrderData.totalFinalPrice,
    OrderData.quotedCurrency,
    OrderData.cratingCost,
    OrderData.insuranceCost,
    OrderData.tax,
    OrderData.shippingCost,
    OrderData.subTotal,
    OrderData.minOrderQuantity,
    OrderData.discount,
    isDepositOrder !== undefined ? isDepositOrder : false, // Use provided value or default to false
    OrderData.isUsaOrCanada || true,
    OrderData.unitOfMeasurement,
    orderToken,
  ];

  try {
    await DB.prepare(updateOrderQuery)
      .bind(...orderValues)
      .run();

    // Delete existing products related to the order
    const deleteOrderProductsQuery = `
      DELETE FROM order_products WHERE order_token = ?;
    `;
    await DB.prepare(deleteOrderProductsQuery).bind(orderToken).run();

    // Insert updated products
    const insertOrderProductQuery = `
      INSERT INTO order_products (
        order_token, width, height, quantity, product_type, square_footage, square_meterage, 
        product_size, total_price, unit_price, insurance_percentage, shipping_cost, unit_of_measurement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    for (const product of OrderData.products) {
      const productValues = [
        orderToken,
        product.width,
        product.height,
        product.quantity,
        product.productType,
        product.squareFootage,
        product.squarMeterage,
        product.size,
        product.totalPrice,
        product.unitPrice,
        product.insurancePercentage,
        product.shippingCost,
        product.unitOfMeasurement,
      ];

      await DB.prepare(insertOrderProductQuery)
        .bind(...productValues)
        .run();
    }

    return true;
  } catch (error) {
    console.error('Error updating order data in the database:', error);
    return false;
  }
}

// services/dbService.ts

async function insertFormData(
  DB: D1Database,
  formData: FormData
): Promise<{ success: boolean; lastRowId: number }> {
  // Check if the user already exists
  const userExistsQuery = `
    SELECT user_id FROM users WHERE email = ? LIMIT 1;
  `;
  const existingUser = await DB.prepare(userExistsQuery).bind(formData.email).all();

  let userId;

  if (existingUser.results.length > 0) {
    // User exists, get the user's ID
    userId = existingUser.results[0].user_id as number;
  } else {
    // User does not exist, insert new user and get the user's ID
    const insertUserQuery = `
      INSERT INTO users (
        user_name, email, phone, project_type, role_in_project, user_location, 
        country, state_or_province
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertUserValues = [
      formData.name,
      formData.email,
      formData.phone,
      formData.projectType,
      formData.roleInProject,
      formData.location,
      formData.country,
      formData.state,
    ];

    const userInsertResult = await DB.prepare(insertUserQuery)
      .bind(...insertUserValues)
      .run();

    if (!userInsertResult.success) {
      console.error('Failed to insert user data:', userInsertResult.error);
      return { success: false, lastRowId: 0 };
    }

    userId = userInsertResult.meta.last_row_id;
  }

  // Here you would continue with creating the order using the userId
  // ...

  return { success: true, lastRowId: userId };
}

async function getUserEmailAndNameByOrderToken(DB: D1Database, orderToken: string) {
  const selectQuery = `
    SELECT u.user_name, u.email, u.phone, o.order_id
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    WHERE o.order_token = ?
  `;

  const userResult = await DB.prepare(selectQuery).bind(orderToken).all();

  if (!userResult || userResult.results.length === 0) {
    console.log('No user found for the given order token.');
    return { success: false, userName: null, email: null, phone: null, orderId: null };
  }

  const user = userResult.results[0];
  const userName = user.user_name as string;
  const email = user.email as string;
  const orderId = user.order_id as number;
  const phone = user.phone as string;
  console.log('User found: ', userName, email, orderId);
  return { success: true, userName, email, phone, orderId };
}

async function insertDepositOrder(
  DB: D1Database,
  OrderData: OrderData,
  orderToken: string
): Promise<{ success: boolean; lastRowId: number }> {
  try {
    // Calculate discount_period_expiry (deposit_payment_date + discount_period days)
    const expiryDate = new Date(Date.now() + OrderData.discountPeriod * 24 * 60 * 60 * 1000);

    // Format the expiry date as: YYYY-MM-DD HH:mm:ss
    const formattedExpiry = expiryDate.toISOString().slice(0, 19).replace('T', ' ');

    const insertQuery = `
      INSERT INTO deposit_order_details (order_token, discount_period_expiry, discount_period)
      VALUES (?, ?, ?)
    `;

    const insertValues = [orderToken, formattedExpiry, OrderData.discountPeriod];

    const result = await DB.prepare(insertQuery)
      .bind(...insertValues)
      .run();

    if (!result.success) {
      console.error('Failed to insert deposit order details');
      return { success: false, lastRowId: 0 };
    }

    return { success: true, lastRowId: result.meta.last_row_id };
  } catch (error) {
    console.error('Error inserting deposit order details:', error);
    return { success: false, lastRowId: 0 };
  }
}

export {
  getUserEmailAndNameByOrderToken,
  insertDepositOrder,
  insertFormData,
  insertOrder,
  updateOrder,
};
// You can add more functions for different queries here
/*
async function getUserEmailAndNameByOrderToken_old(DB: D1Database, orderToken: string) {
  const selectQuery = `
  SELECT u.user_name, u.email, o.order_id
  FROM users u
  JOIN orders o ON u.order_token = o.order_token
  WHERE o.order_token = ?
`;

  const user = await DB.prepare(selectQuery).bind(orderToken).all();

  if (!user || user.results.length === 0) {
    console.log('No user found for the given order token.');
    return { success: false, userName: null, email: null, orderId: null };
  }

  // Assuming order_token is unique and can only correspond to one user
  const userName = user.results[0].user_name as string;
  const email = user.results[0].email as string;
  const orderId = user.results[0].order_id as number;
  console.log('User found: ', user);
  return { success: true, userName, email, orderId };
}

async function insertFormData2(
  DB: D1Database,
  formData: FormData
): Promise<{ success: boolean; lastRowId: number }> {
  const insertQuery = `
  insert into users (user_name, email, phone, project_type, role_in_project, user_location, country, order_token, state_or_province) values (?,?,?,?,?,?,?,?,?)
  `;

  const insertValues = [
    formData.name,
    formData.email,
    formData.phone,
    formData.projectType,
    formData.roleInProject,
    formData.location,
    formData.country,
    formData.orderToken,
    formData.state,
  ];

  const results = await DB.prepare(insertQuery)
    .bind(...insertValues)
    .run();
  console.log('form data inserted: ', results);
  return { success: results.success, lastRowId: results.meta.last_row_id };
}
*/
