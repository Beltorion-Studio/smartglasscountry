// src/components/CalculatorUI.ts
import { Calculator } from '../services/Calculator';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { cloneNode } from '@finsweet/ts-utils';


export class CalculatorUI {
  private calculateBtn: HTMLElement;
  private orderContainer: HTMLDivElement;
  private orderRowsContainer: HTMLDivElement;
  private calculator: Calculator;

  constructor() {
    this.calculateBtn = document.querySelector("[bo-elements='calculate']") as HTMLElement;
    this.orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
    this.orderRowsContainer = this.orderContainer.querySelector('#orderRowsContainer') as HTMLDivElement;

    const order = new Order();
    this.calculator = new Calculator(order);

    if (!this.calculateBtn) {
      throw new Error("Calculate button not found.");
    }

    this.calculateBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.calculate();
    });
  }

  private calculate() {

    const panelsData = this.collectPanelsData();

    console.log(panelsData);
    this.addProductsToOrderForm(panelsData);
    const product = new Product("SomeProductType", { width: 100, height: 200 });
    this.calculator.order.addProduct(product);

    const totalPrice = this.calculator.calculate();
    console.log(totalPrice);
    // Update the UI with the calculated price
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

  private addProductsToOrderForm(panelsData: Record<string, number>[]) {
    const orderRow = this.orderRowsContainer.querySelector(
      "[bo-elements='order-row']"
    ) as HTMLDivElement;
    orderRow.querySelectorAll('div[data-order]').forEach((div) => {
      div.textContent = '';
    });
    this.orderRowsContainer.innerHTML = '';

    panelsData.filter((panelData) => {
        const newRow = cloneNode(orderRow);
        Object.keys(panelData).forEach((key) => {
      const div = newRow.querySelector(`[data-order="${key}"]`) as HTMLDivElement;
      div.textContent = String(panelData[key]);
      this.orderRowsContainer.appendChild(newRow);
    });
  })

  }

}