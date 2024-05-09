import { cloneNode } from '@finsweet/ts-utils';
import { ApiServices } from './services/ApiServices';
import { removeChat } from './utils/removeChat';
import { getOrderToken, getUrlParams } from './utils/utilities';
import { ErrorMessageUI } from './components/ErrorMessageUI';
import { globalSettings } from 'src/settings/globalSettings';
import type { OrderData, UrlParams } from './settings/types';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    removeChat();
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
  const confirmedOrderData = orderData as OrderData;
  const isCountryUsaOrCanada = checkCountry(urlParams);
  console.log(isCountryUsaOrCanada);

  const isMinorder = comperOrderWithMinOrder(confirmedOrderData);
  setButtons(isCountryUsaOrCanada, isMinorder);
  addProductsToOrderForm(confirmedOrderData);
  updateOrderTable(confirmedOrderData);
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

function checkCountry(urlParams: UrlParams): boolean {
  console.log(urlParams.country);

  if (urlParams.country === 'true') {
    return true;
  } else {
    return false;
  }
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
    // modifyOrderBtn.style.display = 'block';
    depositBtn.disabled = true;
    buyBtn.disabled = true;
  } else {
    //  modifyOrderBtn.style.display = 'none';
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
