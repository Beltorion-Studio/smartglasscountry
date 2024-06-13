import { ApiServices } from './services/ApiServices';
import { getOrderToken, getUrlParams } from './utils/utilities';
import { ErrorMessageUI } from './components/ErrorMessageUI';
import { globalSettings } from 'src/settings/globalSettings';
import type { OrderData, UrlParams } from './settings/types';
import axios from 'axios';
import { OrderFormManager } from './components/OrderFormManager';
import { OrderTableManager } from './components/OrderTableManager';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    displayOrders();
  });
});

const orderContainers = [
  ...document.querySelectorAll("[bo-elements='orderContainer']"),
] as HTMLDivElement[];
const orderRowsContainers = orderContainers.map(
  (container) => container.querySelector("[bo-elements='orderRowsContainer']") as HTMLDivElement
) as HTMLDivElement[];
const orderService = new ApiServices(globalSettings.orderUrl);
const urlParams = getUrlParams();
console.log(urlParams);
const errorMessageUI = new ErrorMessageUI();

async function displayOrders() {
  const orderData = await fetchOrder();
  console.log(orderData);

  if (!orderData || Object.keys(orderData).length === 0) {
    console.log('Session is expired, please make a new order.');
    return;
  }

  const confirmedOrderData = orderData as OrderData;
  const isCountryUsaOrCanada = checkCountry(urlParams);
  console.log(isCountryUsaOrCanada);

  const isMinorder = comperOrderWithMinOrder(confirmedOrderData);
  setButtons(isCountryUsaOrCanada, isMinorder);

  const orderFormManager = new OrderFormManager(orderContainers, orderRowsContainers);
  orderFormManager.addProductsToOrderForm(confirmedOrderData);

  const orderTableManager = new OrderTableManager();
  orderTableManager.updateOrderTable(confirmedOrderData);
}

async function fetchOrder(): Promise<OrderData | {}> {
  const orderToken = getOrderToken();
  if (!orderToken) {
    return {};
  }
  const params = {
    orderToken: orderToken,
  };
  try {
    const responseData: OrderData | null = await orderService.fetchDataWithParams(params);
    if (responseData) {
      return responseData;
    }
    return {};
  } catch (error) {
    console.error('Error fetching order data:', error);
    return {};
  }
}

function convertToInches(value: string): string {
  return (parseFloat(value) / 25.4).toFixed(2);
}

function checkCountry(urlParams: UrlParams): boolean {
  console.log(urlParams.country);
  return urlParams.country === 'true';
}

function comperOrderWithMinOrder(orderData: OrderData): boolean {
  const minOrderAmount = orderData.minOrderQuantity;
  if (orderData.totalFinalPrice < minOrderAmount) {
    errorMessageUI.show(
      `Order total must be at least $${minOrderAmount}. Please ad more products to your order.`
    );
    return false;
  }
  return true;
}

function setButtons(isCountryUsaOrCanada: boolean, isMinorder: boolean) {
  const depositBtn = document.querySelector("[bo-elements='depositBtn']") as HTMLButtonElement;
  const buyBtn = document.querySelector("[bo-elements='buyBtn']") as HTMLButtonElement;
  const modifyOrderBtn = document.querySelector("[bo-elements='modifyBtn']") as HTMLButtonElement;

  modifyOrderBtn.addEventListener('click', () => redirectToCalculator(isCountryUsaOrCanada));

  if (!isMinorder) {
    depositBtn.disabled = true;
    buyBtn.disabled = true;
  } else {
    depositBtn.disabled = false;
    buyBtn.disabled = false;
  }

  if (isCountryUsaOrCanada) {
    depositBtn.addEventListener('click', () => redirectToCheckout());
  } else {
    depositBtn.disabled = true;
    errorMessageUI.show(
      'For project cost calculations specific to your country, please contact us directly at info@smartglasscountry.com'
    );
  }

  buyBtn.addEventListener('click', () => createOrder());
  depositBtn.addEventListener('click', () => createDepositOrder());

  function redirectToCheckout() {
    window.location.href = '#';
  }

  function redirectToCalculator(isCountryUsaOrCanada: boolean) {
    console.log(isCountryUsaOrCanada);
    if (isCountryUsaOrCanada) {
      window.location.href = '/calculator?country=true';
    } else {
      window.location.href = '/calculator?country=false';
    }
  }
}

async function createOrder() {
  const orderToken = getOrderToken();
  if (!orderToken) {
    return {};
  }
  try {
    const response = await axios.post(`${globalSettings.checkoutUrl}?orderToken=${orderToken}`);
    console.log('Response:', response.data);
    if (!response.data.sessionId) {
      return;
    }
    redirectToStripeCheckout(response.data.sessionId);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function createDepositOrder() {
  const orderToken = getOrderToken();
  if (!orderToken) {
    return {};
  }
  try {
    const response = await axios.post(`${globalSettings.depositUrl}?orderToken=${orderToken}`);
    console.log('Response:', response.data);
    if (!response.data.sessionId) {
      return;
    }
    redirectToStripeCheckout(response.data.sessionId);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function redirectToStripeCheckout(sessionId: string) {
  const stripe = Stripe(
    'pk_test_51LuHdrHiSI5WqDkH5MnIYUVna1Qp3UqZIPX2zHYphVD4S4tYgX2MxGcxqcCaCpVsUA6vnSERwrCWC81bAJLRcQYW00MYEwaG1h'
  );
  try {
    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    console.error(error);
  }
}
