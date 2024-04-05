import { Calculator } from '../services/Calculator';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { cloneNode } from '@finsweet/ts-utils';
interface PanelData {
  width: number;
  height: number;
  quantity: number;
}
export class CalculatorUI {
  private calculator: Calculator;
  private newOrder: Order | null = null;
  private calculateBtn: HTMLElement;
  private orderContainer: HTMLDivElement;
  private orderRowsContainer: HTMLDivElement;
  private regularPrice: HTMLDivElement;
  private totalprice: HTMLDivElement;
  private discount: HTMLDivElement;
  private unitOfMeasurementSelector: HTMLSelectElement;
  private measurementTitle: HTMLDivElement;

  constructor() {
    this.calculator = new Calculator();
    this.calculateBtn = document.querySelector("[bo-elements='calculate']") as HTMLElement;
    this.orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
    this.orderRowsContainer = this.orderContainer.querySelector(
      '#orderRowsContainer'
    ) as HTMLDivElement;
    this.regularPrice = document.querySelector('#regularPrice') as HTMLDivElement;
    this.totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
    this.discount = document.querySelector('#discount') as HTMLDivElement;
    this.unitOfMeasurementSelector = document.querySelector('#measurement') as HTMLSelectElement;
    this.measurementTitle = document.querySelector('#measurementTitle') as HTMLDivElement;

    this.bindUIEvents();
  }

  bindUIEvents(): void {
    if (!this.calculateBtn) {
      throw new Error('Calculate button not found.');
    }

    this.calculateBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const panelsData = this.collectPanelsData();
      const unitOfMeasurement = this.getUnitOfMeasurement();
      if (unitOfMeasurement === 'mm') {
        this.measurementTitle.textContent = 'SQM';
      } else {
          this.measurementTitle.textContent = 'SQFT';
      }
      const newOrder = new Order(panelsData, unitOfMeasurement);
      this.newOrder = newOrder;
      console.log(newOrder);
      this.addProductsToOrderForm();
      this.updateOrderTable();
    });
  }

  private collectPanelsData(): Record<string, number>[] {
    const panels = Array.from(document.querySelectorAll("[bo-elements='product-panel']"));
    const panelsData: Record<string, number>[] = [];
    panels.forEach((panel, index) => {
      panelsData.push(this.collectPanelData(panel));
    });
    return panelsData;
  }

  private collectPanelData(panel: Element): Record<string, number> {
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

  private addProductsToOrderForm() {
    const orderRow = this.orderRowsContainer.querySelector(
      "[bo-elements='order-row']"
    ) as HTMLDivElement;
    orderRow.querySelectorAll('div[data-order]').forEach((div) => {
      div.textContent = '';
    });
    this.orderRowsContainer.innerHTML = '';
    const products = this.newOrder?.getProducts();
    if (!products) {
      throw new Error('No products in order');
    }
    products.forEach((product) => {
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

  updateOrderTable(): void {
    const prices = this.calculator.calculateOrderPrices(this.newOrder);
    console.log(prices);
    this.regularPrice.textContent = '$' + String(prices.regularPrice.toFixed(2));
    this.totalprice.textContent = '$' + String(prices.finalPrice.toFixed(2));
    this.discount.textContent = '$' + String(prices.discount.toFixed(2));
  }

  getUnitOfMeasurement() {
    console.log(this.unitOfMeasurementSelector.value);
    return this.unitOfMeasurementSelector.value;
  }

  calculatePrices(): void {
    console.log('calculatePrices');
  }
}