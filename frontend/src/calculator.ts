import { CalculatorUI } from './components/CalculatorUI';
import { PanelDuplicator } from './components/PanelDuplicator';
import { removeChat } from './utils/removeChat';
import { cloneNode } from '@finsweet/ts-utils';
import type { OrderData } from './settings/types';
import { ApiServices } from './services/ApiServices';
import { globalSettings } from './settings/globalSettings';
import { getOrderToken } from './utils/utilities';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    removeChat();
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
    const unitOfMeasurementSelector = document.querySelector('#measurement') as HTMLSelectElement;
    const productTypeSelector = document.querySelector('#productType') as HTMLSelectElement;
    unitOfMeasurementSelector.value = orders.unitOfMeasurement;
    productTypeSelector.value = orders.productType;
 

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
