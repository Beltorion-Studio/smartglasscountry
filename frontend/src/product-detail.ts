import { cloneNode } from '@finsweet/ts-utils';
import { ApiServices } from './services/ApiServices';
import { removeChat } from './utils/removeChat';
import { ErrorMessageUI } from './components/ErrorMessageUI';
import { globalSettings } from 'src/settings/globalSettings';
import type { OrderData } from './settings/types';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    removeChat();
    setButtons();
    displayOrders();
  });
});

const orderContainers = [
  ...document.querySelectorAll("[bo-elements='orderContainer']"),
] as HTMLDivElement[];
const orderRowsContainers = orderContainers.map(
  (container) => container.querySelector("[bo-elements='orderRowsContainer']") as HTMLDivElement
) as HTMLDivElement[];
const regularPrice = document.querySelector('#regularPrice') as HTMLDivElement;
const shippingPrice = document.querySelector('#ShippingPrice') as HTMLDivElement;
const cratingPrice = document.querySelector('#cratingPrice') as HTMLDivElement;
const insurancePrice = document.querySelector('#insurancePrice') as HTMLDivElement;
const subTotal = document.querySelector('#subTotalPrice') as HTMLDivElement;
const totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
const discount = document.querySelector('#discount') as HTMLDivElement;
const discountValue = document.querySelector("[bo-elements='discount-value']") as HTMLElement;
const discountPeriod = document.querySelector("[data-order='discountPeriod']") as HTMLDivElement;
const orderService = new ApiServices(globalSettings.orderUrl);
const urlParams = getUrlParams();
const errorMessageUI = new ErrorMessageUI();

async function displayOrders() {
  const orderData = await fetchOrder();
  console.log(orderData);
  /* 
  if (orderData.unitOfMeasurement === 'mm') {
    measurementTitle.textContent = 'SQM';
  } else {
    measurementTitle.textContent = 'SQFT';
  } */

  if (!orderData || Object.keys(orderData).length === 0) {
    console.log('Session is expired, please make a new order.');
    return;
  }
  addProductsToOrderForm(orderData);
  updateOrderTable(orderData);
}

function clearOrderRows(orderRows: HTMLDivElement[]) {
  orderRows.forEach((orderRow) => {
    orderRow.querySelectorAll('div[data-order]').forEach((div) => {
      div.textContent = '';
    });
  });
}

function clearOrderRowsContainers(orderRowsContainers: HTMLDivElement[]) {
  orderRowsContainers.forEach((orderRow) => {
    orderRow.innerHTML = '';
  });
}

function setCellContent(
  cell: HTMLDivElement | HTMLInputElement,
  key: string,
  product: any,
  orderData: any
) {
  if (key === 'productType') {
    cell.textContent = String(product[key]);
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
}

function createAndAppendNewRows(orderRows: HTMLDivElement[], orderData: any) {
  const products = orderData.products;
  products.forEach((product: any) => {
    orderRows.forEach((orderRow, index: number) => {
      const newRow = cloneNode(orderRow);
      Object.keys(product).forEach((key) => {
        formatProductName(product, key);
        const cell = newRow.querySelector(`[data-order="${key}"]`) as
          | HTMLDivElement
          | HTMLInputElement;
        if (cell) {
          setCellContent(cell, key, product, orderData);
        }
      });
      orderRowsContainers[index].appendChild(newRow);
    });
  });
}

function addProductsToOrderForm(orderData: any): void {
  const orderRows = Array.from(orderContainers, (container) => {
    return container.querySelector("[bo-elements='order-row']");
  }) as HTMLDivElement[];

  clearOrderRows(orderRows);
  clearOrderRowsContainers(orderRowsContainers);
  createAndAppendNewRows(orderRows, orderData);
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

function updateOrderTable(orderData: OrderData): void {
  const orderTablePrices = document.querySelectorAll(
    '[data-order-details]'
  ) as NodeListOf<HTMLDivElement>;

  function updateElementText(element: HTMLDivElement, value: any, key: string): void {
    if (typeof value === 'number') {
      updateElementWithNumber(element, value, key);
    } else if (typeof value === 'string') {
      updateElementWithString(element, value, key);
    }
  }

  function updateElementWithNumber(element: HTMLDivElement, value: number, key: string): void {
    if (key === 'discountAmount') {
      element.textContent = `-$${Math.abs(value).toFixed(2)}`;
    } else if (key !== 'discountPeriod') {
      element.textContent = `$${value.toFixed(2)}`;
    }
  }

  function updateElementWithString(element: HTMLDivElement, value: string, key: string): void {
    if (key === 'productType') {
      const productTypes = {
        smartFilm: 'Smart Film',
        smartGlass: 'Smart Glass',
        igu: 'IGU',
      };
      element.textContent = productTypes[value] || '';
    } else if (key === 'discount') {
      element.textContent = value;
    }
  }

  orderTablePrices.forEach((element) => {
    const detailKey = element.getAttribute('data-order-details');
    if (detailKey && orderData.hasOwnProperty(detailKey)) {
      const value = orderData[detailKey];
      updateElementText(element, value, detailKey);
    }
  });
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

  buyBtn.addEventListener('click', () => createOrder());

  function redirectToCheckout() {
    window.location.href = '/calculator';
  }

  function createOrder() {
    axios
      .get('http://127.0.0.1:8787/checkout')
      .then((response) => {
        // Handle the response data here
        console.log('Response:', response.data);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
      });
  }
}
