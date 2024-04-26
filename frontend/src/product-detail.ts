import { cloneNode } from '@finsweet/ts-utils';
import { ApiServices } from './services/ApiServices';
import { removeChat } from './utils/removeChat';
import { ErrorMessageUI } from './components/ErrorMessageUI';
import { globalSettings } from 'src/settings/globalSettings';

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
const shippingPrice = document.querySelector('#ShippingPrice') as HTMLDivElement;
const cratingPrice = document.querySelector('#cratingPrice') as HTMLDivElement;
const insurancePrice = document.querySelector('#insurancePrice') as HTMLDivElement;
const subTotal = document.querySelector('#subTotalPrice') as HTMLDivElement;
const totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
const discount = document.querySelector('#discount') as HTMLDivElement;
const discountValue = document.querySelector("[bo-elements='discount-value']") as HTMLElement;
const measurementTitle = document.querySelector("[bo-elements='size']") as HTMLDivElement;
const orderTitle = document.querySelector('.order-title') as HTMLDivElement;
const orderService = new ApiServices(globalSettings.orderUrl);
const urlParams = getUrlParams();
const errorMessageUI = new ErrorMessageUI();

async function displayOrders() {
  const orderData = await fetchOrder();
  console.log(orderData);

  if (orderData.unitOfMeasurement === 'mm') {
    measurementTitle.textContent = 'SQM';
  } else {
    measurementTitle.textContent = 'SQFT';
  }

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
      formatProductName(product, key);
      const cell = newRow.querySelector(`[data-order="${key}"]`) as HTMLInputElement;
      if (!cell) {
        return;
      }
      if (key === 'productType') {
        orderTitle.textContent = product[key];
      } else if (key === 'quantity') {
        cell.textContent = String(product[key]) + ' pcs';
      } else if (key === 'height' || key === 'width') {
        cell.textContent = String(product[key] + ' ' + orderData.unitOfMeasurement);
      } else if (key === 'totalPrice') {
        cell.textContent = String(product[key].toFixed(2));
      } else if (key === 'size') {
        cell.textContent = String(
          product[key] + ' ' + (orderData.unitOfMeasurement === 'mm' ? 'SQM' : 'SQFT')
        );
      } else {
        cell.textContent = String(product[key]);
      }
    });
    orderRowsContainer.appendChild(newRow);
  });
}

function formatProductName(product: any, key: string) {
  if (product[key] === 'smartFilm') {
    product[key] = 'Smart Film';
  } else if (product[key] === 'smartGlass') {
    product[key] = 'Smart Glass';
  } else if (product[key] === 'igu') {
    product[key] = 'IGU';
  }
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
  regularPrice.textContent = '$' + String(orderData.totalRegularPrice.toFixed(2));
  shippingPrice.textContent = '$' + String(orderData.shippingCost.toFixed(2));
  cratingPrice.textContent = '$' + String(orderData.cratingCost.toFixed(2));
  insurancePrice.textContent = '$' + String(orderData.insuranceCost.toFixed(2));
  subTotal.textContent = '$' + String(orderData.subTotal.toFixed(2));
  discount.textContent = '$' + String(orderData.discountAmount.toFixed(2));
  discountValue.textContent = String(orderData.discount);
  totalprice.textContent = '$' + String(orderData.totalFinalPrice.toFixed(2));
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
      'For project cost calculations specific to your country, please contact us directly at info@smartglasscountry.com'
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
