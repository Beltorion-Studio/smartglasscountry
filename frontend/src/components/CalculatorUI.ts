import { Order } from '../models/Order';
import { cloneNode } from '@finsweet/ts-utils';
import { ErrorMessageUI } from './ErrorMessageUI';
import { ApiServices } from 'src/services/ApiServices';
interface PanelData {
  width: number;
  height: number;
  quantity: number;
}
export class CalculatorUI {
  private calculateBtn: HTMLElement;
  private orderContainer: HTMLDivElement;
  private orderRowsContainer: HTMLDivElement;
  private regularPrice: HTMLDivElement;
  private totalprice: HTMLDivElement;
  private discount: HTMLDivElement;
  private discountValue: HTMLElement;
  private unitOfMeasurementSelector: HTMLSelectElement;
  private productTypeSelector: HTMLSelectElement;
  private measurementTitle: HTMLDivElement;
  private errorMessageUI: ErrorMessageUI;
  private orderService: ApiServices;
  private dashboardService: ApiServices;
  private dashboardData!: Record<string, string>;
  private productMaxWidth: string = '';
  private productMaxHeight: string = '';

  constructor() {
    this.calculateBtn = document.querySelector("[bo-elements='calculate']") as HTMLElement;
    this.orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
    this.orderRowsContainer = this.orderContainer.querySelector(
      '#orderRowsContainer'
    ) as HTMLDivElement;
    this.regularPrice = document.querySelector('#regularPrice') as HTMLDivElement;
    this.totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
    this.discount = document.querySelector('#discount') as HTMLDivElement;
    this.discountValue = document.querySelector("[bo-elements='discount-value']") as HTMLElement;
    this.unitOfMeasurementSelector = document.querySelector('#measurement') as HTMLSelectElement;
    this.productTypeSelector = document.querySelector('#productType') as HTMLSelectElement;
    this.measurementTitle = document.querySelector('#measurementTitle') as HTMLDivElement;
    this.errorMessageUI = new ErrorMessageUI();
    //this.orderService = new ApiServices('http://127.0.0.1:8787/order');
    this.orderService = new ApiServices('https://backend.beltorion.workers.dev/order');
    this.dashboardService = new ApiServices('https://backend.beltorion.workers.dev/dashboard');
    this.removeErrorFromInputs();
    this.bindUIEvents();
    this.fetchDashboardValues().then((data) => (this.dashboardData = data));
    this.addEventListenerToProductTypeSelector();
    this.addEventListenerToMeasurementSelector();
  }

  private removeErrorFromInputs() {
    const inputFields = document.querySelectorAll('.input-field input');
    inputFields.forEach((inputField) => {
      inputField.addEventListener('input', () => {
        inputField.classList.remove('form-error');
        this.errorMessageUI.hide();
      });
    });
  }

  bindUIEvents(): void {
    if (!this.calculateBtn) {
      throw new Error('Calculate button not found.');
    }

    this.calculateBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      const panelsData = this.collectPanelsData();
      if (panelsData.length === 0) {
        return;
      }
      const unitOfMeasurement = this.getUnitOfMeasurement();
      const productType = this.getProductType();
      this.validateProductType(productType);
      if (unitOfMeasurement === 'mm') {
        this.measurementTitle.textContent = 'SQM';
      } else {
        this.measurementTitle.textContent = 'SQFT';
      }
      const newOrder = new Order(panelsData, unitOfMeasurement, productType);
      const responseData = await this.submitOrder(newOrder);
      console.log(responseData);
      this.addProductsToOrderForm(responseData);
      this.updateOrderTable(responseData);
    });
  }

  private async submitOrder(orderData: any): Promise<void> {
    try {
      const response = await this.orderService.sendData(orderData);
      // console.log('Order submitted successfully:');
      return response;
    } catch (error) {
      // Handle errors (e.g., show error message in the UI)
      console.error('There was an error sending the order to the API:', error);
      // ... Handle error
    }
  }

  private collectPanelsData(): Record<string, number>[] {
    const panels = Array.from(document.querySelectorAll("[bo-elements='product-panel']"));
    const panelsData: Record<string, number>[] = [];
    panels.forEach((panel) => {
      const panelData = this.collectPanelData(panel);
      if (panelData) {
        panelsData.push(panelData);
      }
    });

    return panelsData;
  }

  private collectPanelData(panel: Element): Record<string, number> | null {
    if (!this.validatePanelData(panel)) {
      return null;
    }
    const inputFields = panel.querySelectorAll('.input-field input');
    const panelData: Record<string, number> = {};

    inputFields.forEach((inputField) => {
      const input = inputField as HTMLInputElement;
      const name = input.dataset.name as string;
      const value = Number(input.value);
      panelData[name] = value;
    });

    return panelData;
  }

  private addProductsToOrderForm(orderData: any): void {
    const orderRow = this.orderRowsContainer.querySelector(
      "[bo-elements='order-row']"
    ) as HTMLDivElement;
    orderRow.querySelectorAll('div[data-order]').forEach((div) => {
      div.textContent = '';
    });
    this.orderRowsContainer.innerHTML = '';
    const products = orderData.products;
    if (!products) {
      throw new Error('No products in order');
    }
    products.forEach((product: any) => {
      const newRow = cloneNode(orderRow);
      Object.keys(product).forEach((key) => {
        const div = newRow.querySelector(`[data-order="${key}"]`) as HTMLDivElement;
        if (div) {
          div.textContent = String(product[key]);
        }
      });
      this.orderRowsContainer.appendChild(newRow);
    });
  }

  updateOrderTable(orderData: any): void {
    this.regularPrice.textContent = '$' + String(orderData.TotalRegularPrice.toFixed(2));
    this.totalprice.textContent = '$' + String(orderData.TotalFinalPrice.toFixed(2));
    this.discount.textContent = '$' + String(orderData.DiscountAmount.toFixed(2));
    this.discountValue.textContent = String(orderData.discount);
  }

  getUnitOfMeasurement() {
    return this.unitOfMeasurementSelector.value;
  }
  getProductType() {
    return this.productTypeSelector.value;
  }

  private convertToInches(value: string): string {
    return (parseFloat(value) / 25.4).toFixed(2);
  }

  private updateDOMElements(selector: string, attribute: string, value: string, unit: string) {
    const textElements = document.querySelectorAll(selector) as NodeListOf<HTMLDivElement>;
    const attrElements = document.querySelectorAll(
      `[projectGroup='${attribute}']`
    ) as NodeListOf<HTMLInputElement>;
    textElements.forEach((element) => {
      element.textContent = `${value} ${unit}`;
    });
    attrElements.forEach((element) => {
      element.setAttribute('max', value);
    });
  }

  setMaxWidth(productType: string, unitOfMeasurement: string) {
    let productMaxWidth: string = this.dashboardData[`${productType}Width`];
    if (unitOfMeasurement === 'inches') {
      productMaxWidth = this.convertToInches(productMaxWidth);
    }
    this.updateDOMElements(
      "[bo-elements='max-width']",
      'width',
      productMaxWidth,
      unitOfMeasurement
    );
  }

  setMaxHeight(productType: string, unitOfMeasurement: string) {
    let productMaxHeight: string = this.dashboardData[`${productType}Height`];
    if (unitOfMeasurement === 'inches') {
      productMaxHeight = this.convertToInches(productMaxHeight);
    }
    this.updateDOMElements(
      "[bo-elements='max-height']",
      'height',
      productMaxHeight,
      unitOfMeasurement
    );
  }

  setMaxWidthAndHeight() {
    const productType = this.getProductType();
    const unitOfMeasurement = this.getUnitOfMeasurement();
    let maxWidth = this.dashboardData[`${productType}Width`];
    let maxHeight = this.dashboardData[`${productType}Height`];

    if (unitOfMeasurement === 'inches') {
      maxWidth = this.convertToInches(maxWidth);
      maxHeight = this.convertToInches(maxHeight);
    }

    this.productMaxWidth = maxWidth;
    this.productMaxHeight = maxHeight;
    this.setMaxHeight(productType, unitOfMeasurement);
    this.setMaxWidth(productType, unitOfMeasurement);
  }

  addEventListenerToProductTypeSelector() {
    this.productTypeSelector.addEventListener('change', () => {
      this.setMaxWidthAndHeight();
    });
  }
  addEventListenerToMeasurementSelector() {
    this.unitOfMeasurementSelector.addEventListener('change', () => {
      this.setMaxWidthAndHeight();
    });
  }

  validateProductType(productType: string): boolean {
    if (!productType || productType === 'productType') {
      this.errorMessageUI.show('Please select a product type.');
      return false;
    } else {
      this.errorMessageUI.hide();
      return true;
    }
  }

  async fetchDashboardValues(): Promise<Record<string, string>> {
    const responseData = await this.dashboardService.fetchData();
    console.log(responseData);
    return responseData;
  }

  private validatePanelData(panel: Element): boolean {
    let isValid = true;
    const productMaxWidth = this.productMaxWidth;
    const productMaxHeight = this.productMaxHeight;
    const inputFields = panel.querySelectorAll('.input-field input');
  
    // Perform all validations first before manipulating the UI error messages.
    for (const inputField of inputFields) {
      const input = inputField as HTMLInputElement;
      const value = Number(input.value);
      const projectGroup = input.getAttribute('projectGroup');
  
      if (isNaN(value) || value <= 0) {
        input.classList.add('form-error');
        this.errorMessageUI.show('Please correct the highlighted fields.');
        isValid = false;
      } else if (projectGroup === 'width' && value > parseInt(productMaxWidth)) {
        input.classList.add('form-error');
        this.errorMessageUI.show(`Width cannot be more than ${productMaxWidth}.`);
        isValid = false;
        break; 
      } else if (projectGroup === 'height' && value > parseInt(productMaxHeight)) {
        input.classList.add('form-error');
        this.errorMessageUI.show(`Height cannot be more than ${productMaxHeight}.`);
        isValid = false;
        break; 
      }
    }
  
    if (isValid) {
      inputFields.forEach(inputField => {
        inputField.classList.remove('form-error');
      });
      this.errorMessageUI.hide();
    }
  
    return isValid;
  }
}
