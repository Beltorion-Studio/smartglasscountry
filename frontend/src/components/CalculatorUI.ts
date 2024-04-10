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
  private unitOfMeasurementSelector: HTMLSelectElement;
  private productTypeSelector: HTMLSelectElement;
  private measurementTitle: HTMLDivElement;
  private errorMessageUI: ErrorMessageUI;
  private orderService: ApiServices;

  constructor() {
    this.calculateBtn = document.querySelector("[bo-elements='calculate']") as HTMLElement;
    this.orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
    this.orderRowsContainer = this.orderContainer.querySelector(
      '#orderRowsContainer'
    ) as HTMLDivElement;
    this.regularPrice = document.querySelector('#regularPrice') as HTMLDivElement;
    this.totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
    this.discount = document.querySelector('#discount') as HTMLDivElement;
    this.unitOfMeasurementSelector = document.querySelector('#measurement') as HTMLSelectElement;
    this.productTypeSelector = document.querySelector('#productType') as HTMLSelectElement;
    this.measurementTitle = document.querySelector('#measurementTitle') as HTMLDivElement;
    this.errorMessageUI = new ErrorMessageUI();
    this.orderService = new ApiServices('https://backend.beltorion.workers.dev/order');

    this.removeErrorFromInputs();
    this.bindUIEvents();
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
  }

  getUnitOfMeasurement() {
    return this.unitOfMeasurementSelector.value;
  }
  getProductType() {
    return this.productTypeSelector.value;
  }

  calculatePrices(): void {
    console.log('calculatePrices');
  }

  private validatePanelData(panel: Element): boolean {
    let isValid = true;
    const inputFields = panel.querySelectorAll('.input-field input');

    inputFields.forEach((inputField) => {
      const input = inputField as HTMLInputElement;
      const value = Number(input.value);

      if (isNaN(value) || value <= 0) {
        input.classList.add('form-error');
        this.errorMessageUI.show('Please correct the highlighted fields.');
        isValid = false;
      } else {
        input.classList.remove('form-error');
        this.errorMessageUI.hide();
      }
    });

    return isValid;
  }
}
