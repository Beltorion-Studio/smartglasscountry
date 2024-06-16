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
        order_token, user_id, discount, unit_of_measurement, total_regular_price, discount_amount, total_final_price, 
        quoted_currency, crating_cost, insurance_cost, tax, shipping_cost, sub_total, discount_period, 
        min_order_quantity, is_new_order, is_usa_or_canada
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

  const orderValues = [
    orderToken,
    userId,
    OrderData.discount,
    OrderData.unitOfMeasurement,
    OrderData.totalRegularPrice,
    OrderData.discountAmount,
    OrderData.totalFinalPrice,
    OrderData.quotedCurrency,
    OrderData.cratingCost,
    OrderData.insuranceCost,
    OrderData.tax,
    OrderData.shippingCost,
    OrderData.subTotal,
    OrderData.discountPeriod,
    OrderData.minOrderQuantity,
    true, // Assuming this is a new order
    true, // Assuming the order is for USA or Canada
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
  orderToken: string
): Promise<boolean> {
  const updateOrderQuery = `
      UPDATE orders
      SET discount = ?, unit_of_measurement = ?, total_regular_price = ?, discount_amount = ?, 
          total_final_price = ?, quoted_currency = ?, crating_cost = ?, insurance_cost = ?, tax = ?, 
          shipping_cost = ?, sub_total = ?, discount_period = ?, min_order_quantity = ?, is_new_order = ?, 
          is_usa_or_canada = ?
      WHERE order_token = ?;
    `;

  const orderValues = [
    OrderData.discount,
    OrderData.unitOfMeasurement,
    OrderData.totalRegularPrice,
    OrderData.discountAmount,
    OrderData.totalFinalPrice,
    OrderData.quotedCurrency,
    OrderData.cratingCost,
    OrderData.insuranceCost,
    OrderData.tax,
    OrderData.shippingCost,
    OrderData.subTotal,
    OrderData.discountPeriod,
    OrderData.minOrderQuantity,
    true, // Assuming this is a new order
    true, // Assuming the order is for USA or Canada
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

async function getUserEmailAndNameByOrderToken(DB: D1Database, orderToken: string) {
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

export { getUserEmailAndNameByOrderToken, insertFormData, insertOrder, updateOrder };
// You can add more functions for different queries here