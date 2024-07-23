import { Order } from '../models/Order';
import { ErrorMessageUI } from './ErrorMessageUI';
import { ApiServices } from 'src/services/ApiServices';
import { globalSettings } from 'src/settings/globalSettings';
import { getOrderToken, getUrlParams } from 'src/utils/utilities';
import type { UrlParams } from 'src/settings/types';

type PanelData = {
  width: number;
  height: number;
  quantity: number;
};

interface OrderResponse {
  redirectUrl?: string;
  orderToken?: string;
  error?: string;
}
export class CalculatorUI {
  private calculateBtn: HTMLElement;
  private unitOfMeasurementSelector: HTMLSelectElement;
  private productTypeSelector: HTMLSelectElement;
  private errorMessageUI: ErrorMessageUI;
  private orderService: ApiServices;
  private productMaxWidth: string = '';
  private productMaxHeight: string = '';
  private imageContainter: HTMLDivElement;
  private isNewOrder: boolean;
  private urlParams: UrlParams;

  constructor(isNewOrder: boolean) {
    this.calculateBtn = document.querySelector("[bo-elements='calculate']") as HTMLElement;
    this.unitOfMeasurementSelector = document.querySelector('#measurement') as HTMLSelectElement;
    this.productTypeSelector = document.querySelector('#productType') as HTMLSelectElement;
    this.imageContainter = document.querySelector('.panel-img-container') as HTMLDivElement;
    this.errorMessageUI = new ErrorMessageUI();
    this.orderService = new ApiServices(globalSettings.orderUrl);
    this.isNewOrder = isNewOrder;
    this.urlParams = getUrlParams();
    this.removeErrorFromInputs();
    this.bindUIEvents();
    this.addEventListenerToProductTypeSelector();
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
      const isProductTypeValid = this.validateProductType(productType);
      if (!isProductTypeValid) {
        return;
      }
      console.log(panelsData);
      const newOrder = new Order(panelsData, unitOfMeasurement, productType, this.isNewOrder);
      const orderToken = getOrderToken() ?? undefined;
      console.log(orderToken);
      const responseData = await this.submitOrder(newOrder, orderToken);
      if (responseData.redirectUrl && responseData.orderToken) {
        sessionStorage.setItem('orderToken', responseData.orderToken);
        let redirectUrl = responseData.redirectUrl;
        if (Object.keys(this.urlParams).length !== 0 && this.urlParams.country !== undefined) {
          redirectUrl += `?country=${this.urlParams.country}`;
        }
        window.location.href = redirectUrl;
      }
    });
  }

  private async submitOrder(
    orderData: Order,
    orderToken?: string | undefined
  ): Promise<OrderResponse> {
    try {
      const response = await this.orderService.sendData(orderData, orderToken);
      console.log(response);
      return response;
    } catch (error) {
      console.error('There was an error sending the order to the API:', error);
      throw error;
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

  private collectPanelData(panel: Element): PanelData | null {
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

    return panelData as PanelData;
  }

  getUnitOfMeasurement() {
    return this.unitOfMeasurementSelector.value;
  }
  getProductType() {
    return this.productTypeSelector.value;
  }

  changeProductImg() {
    const productType = this.getProductType();
    if (productType === 'productType') {
      //TODO: add a default image
      return;
    }
    const images = this.imageContainter.querySelectorAll('.calculator-img-w');
    images.forEach((image) => {
      image.classList.remove('selected-image');
    });
    const image = this.imageContainter.querySelector(
      `[bo-elements='${productType}']`
    ) as HTMLDivElement;
    image.classList.add('selected-image');
  }

  addEventListenerToProductTypeSelector() {
    this.productTypeSelector.addEventListener('change', () => {
      this.changeProductImg();
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
      inputFields.forEach((inputField) => {
        inputField.classList.remove('form-error');
      });
      this.errorMessageUI.hide();
    }

    return isValid;
  }
}
