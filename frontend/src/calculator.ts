import { CalculatorUI } from './components/CalculatorUI';
import { PanelDuplicator } from './components/PanelDuplicator';
import { cloneNode } from '@finsweet/ts-utils';
import type { OrderData } from './settings/types';
import { ApiServices } from './services/ApiServices';
import { globalSettings } from './settings/globalSettings';
import { getOrderToken } from './utils/utilities';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    resetForm()
    new CalculatorUI(isNewOrder);
  });
});
const productPanel = document.querySelector("[bo-elements='product-panel']") as HTMLDivElement;
const panelTemplate: HTMLDivElement = cloneNode(productPanel);
const panelDuplicator = new PanelDuplicator(panelTemplate);
let isNewOrder: boolean = true;

const orderToken = getOrderToken();
if (orderToken) {
  addOrdersToUI(orderToken);
  isNewOrder = false;
}

const addPanelBtn = document.querySelector("[bo-elements='addPanel']");
if (addPanelBtn) {
  addPanelBtn.addEventListener('click', () => {
    panelDuplicator.duplicatePanel();
  });
}

async function addOrdersToUI(orderToken: string) {
  const orderData = await fetchOrder(orderToken);
  console.log(orderData);

  if ('products' in orderData) {
    const orders = orderData;
    const panelContainer = document.querySelector('.panel-container') as HTMLDivElement;
    const productPanelTemplate = document.querySelector(
      "[bo-elements='product-panel']"
    ) as HTMLDivElement;
    const productTypeSelector = document.querySelector('#productType') as HTMLSelectElement;
    const productTypeText = document.querySelector(
      "[bo-elements='product-type-selector']"
    ) as HTMLDivElement;
    const unitOfMeasurementSelector = document.querySelector('#measurement') as HTMLSelectElement;
    const unitOfMeasurementText = document.querySelector(
      "[bo-elements='measurement-selector']"
    ) as HTMLDivElement;
    const productTypeListElements = document.querySelectorAll(
      'nav[bo-elements="productTypeList"] a'
    ) as NodeListOf<HTMLAnchorElement>;
    const measurementListElements = document.querySelectorAll(
      'nav[bo-elements="measurementList"] a'
    ) as NodeListOf<HTMLAnchorElement>;

    console.log(orders.productType, orders.unitOfMeasurement);
    setSelectorValueAndText(
      productTypeSelector,
      productTypeText,
      orders.productType,
      productTypeListElements
    );
    setSelectorValueAndText(
      unitOfMeasurementSelector,
      unitOfMeasurementText,
      orders.unitOfMeasurement,
      measurementListElements
    );

    productTypeSelector.addEventListener('change', () =>
      updateSelectorText(productTypeSelector, productTypeText)
    );
    unitOfMeasurementSelector.addEventListener('change', () =>
      updateSelectorText(unitOfMeasurementSelector, unitOfMeasurementText)
    );

    if (orders.products.length > 0) {
      fillPanelWithProductData(productPanelTemplate, orders.products[0]);
    }

    for (let i = 1; i < orders.products.length; i++) {
      panelDuplicator.duplicatePanel();
      const newPanel = panelContainer.lastElementChild as HTMLDivElement;
      if (newPanel) {
        fillPanelWithProductData(newPanel, orders.products[i]);
      }
    }
  } else {
    console.error('Order data is not valid:', orderData);
  }
}

function setSelectorValueAndText(
  selector: HTMLSelectElement,
  textElement: HTMLDivElement,
  value: string,
  listElements: NodeListOf<HTMLAnchorElement>
) {
  selector.value = value;
  const optionText = Array.from(selector.options).find((option) => option.value === value)?.text;
  textElement.textContent = optionText ?? null;
  setAriaLabel(listElements, optionText as string);
}

function setAriaLabel(list: NodeListOf<HTMLAnchorElement>, value: string) {
  console.log(value);
  list.forEach((element) => {
    if (element.textContent === value) {
      element.setAttribute('aria-selected', 'true');
      element.tabIndex = 0;
      element.classList.add('w--current');
    } else {
      element.setAttribute('aria-selected', 'false');
      element.tabIndex = -1;
      element.classList.remove('w--current');
    }
  });
}

function updateSelectorText(selector: HTMLSelectElement, textElement: HTMLDivElement) {
  const selectedValue = selector.value;
  const selectedOptionText = Array.from(selector.options).find(
    (option) => option.value === selectedValue
  )?.text;
  textElement.textContent = selectedOptionText ?? null;
}

function fillPanelWithProductData(panel: HTMLDivElement, product: any) {
  (panel.querySelector("[projectgroup='width']") as HTMLInputElement).value = product.width;
  (panel.querySelector("[projectgroup='height']") as HTMLInputElement).value = product.height;
  (panel.querySelector("[projectgroup='quantity']") as HTMLInputElement).value = product.quantity;
}
async function fetchOrder(orderToken: string): Promise<OrderData | {}> {
  const orderService = new ApiServices(globalSettings.orderUrl);
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
function resetForm(): void {
  const resetBtn = document.querySelector("[bo-elements='reset']");
  if (!resetBtn) return;

  resetBtn.addEventListener('click', (event) => {
    console.log('reset form');
    event.preventDefault();
    sessionStorage.removeItem('orderToken');
    const inputFields = document.querySelectorAll('.input-field input');
    inputFields.forEach((inputField) => {
      inputField.value = '';
    });
  });
}
