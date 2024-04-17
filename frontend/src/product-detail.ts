import { cloneNode } from '@finsweet/ts-utils';
import { ApiServices } from './services/ApiServices';
import { removeChat } from './utils/removeChat';
import { ErrorMessageUI } from './components/ErrorMessageUI';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    removeChat();
    setButtons();
    displayOrders();
  });
});

const orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
const orderRowsContainer = orderContainer.querySelector('#orderRowsContainer') as HTMLDivElement;
const regularPrice = document.querySelector('#regularPrice') as HTMLDivElement;
const totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
const discount = document.querySelector('#discount') as HTMLDivElement;
const discountValue = document.querySelector("[bo-elements='discount-value']") as HTMLElement;
//const orderService = new ApiServices('https://backend.beltorion.workers.dev/order');
const orderService = new ApiServices('http://127.0.0.1:8787/order');
const urlParams = getUrlParams();
const errorMessageUI = new ErrorMessageUI();

async function displayOrders() {
  const orderData = await fetchOrder();
  console.log(orderData);
  //if the order data empty return
  if (!orderData || Object.keys(orderData).length === 0) {
    console.log('Session is expired, please make a new order.');
    return;
  }
  addProductsToOrderForm(orderData);
  updateOrderTable(orderData);
}

function addProductsToOrderForm(orderData: any): void {
  const orderRow = orderRowsContainer.querySelector("[bo-elements='order-row']") as HTMLDivElement;
  orderRow.querySelectorAll('div[data-order]').forEach((div) => {
    div.textContent = '';
  });
  orderRowsContainer.innerHTML = '';

  const products = orderData.products;
  products.forEach((product: any) => {
    const newRow = cloneNode(orderRow);
    Object.keys(product).forEach((key) => {
      const cell = newRow.querySelector(`[data-order="${key}"]`) as HTMLInputElement;
      if (cell) {
        cell.value = String(product[key]);
      }
    });
    orderRowsContainer.appendChild(newRow);
  });
}

function getOrderToken(): string | null {
  return sessionStorage.getItem('orderToken');
}

async function fetchOrder(): Promise<Record<string, string>> {
  const orderToken = getOrderToken();
  if (!orderToken) {
    return {};
  }
  const params = {
    orderToken: orderToken,
  };
  const responseData = await orderService.fetchDataWithParams(params);
  return responseData;
}

function updateOrderTable(orderData: any): void {
  regularPrice.textContent = '$' + String(orderData.TotalRegularPrice.toFixed(2));
  totalprice.textContent = '$' + String(orderData.TotalFinalPrice.toFixed(2));
  discount.textContent = '$' + String(orderData.DiscountAmount.toFixed(2));
  discountValue.textContent = String(orderData.discount);
}

function convertToInches(value: string): string {
  return (parseFloat(value) / 25.4).toFixed(2);
}

function getUrlParams(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

function setButtons() {
  const depositBtn = document.querySelector("[bo-elements='depositBtn']") as HTMLButtonElement;
  const buyBtn = document.querySelector("[bo-elements='buyBtn']") as HTMLButtonElement;
  console.log(urlParams.country);
  if (urlParams.country === 'true') {
    depositBtn.addEventListener('click', () => redirectToCheckout());
  } else {
    depositBtn.disabled = true;
    errorMessageUI.show(
      'Customers from outside of USA and Canada, please contact the merchant directly via email or phone'
    );
  }

  buyBtn.addEventListener('click', () => redirectToSamples());

  function redirectToCheckout() {
    window.location.href = '/calculator';
  }

  function redirectToSamples() {
    window.location.href = 'samples.html';
  }
}