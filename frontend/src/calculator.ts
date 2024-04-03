import { cloneNode } from '@finsweet/ts-utils';
import { duplicatePanel,  } from './utils/duplicatePanel';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    duplicatePanel();
    removeChat();
    removeChat();
    const calculator = new Calculator();
  });
});

class Calculator {
  private calculateBtn: HTMLElement;
  private calculatorForm: HTMLFormElement;
  private orderContainer: HTMLDivElement;
  private orderRowsContainer: HTMLDivElement;

  constructor() {
    this.calculateBtn = document.querySelector("[bo-elements='calculate']") as HTMLElement;
    this.calculatorForm = document.querySelector('#wf-form-calculator') as HTMLFormElement;
    this.orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
    this.orderRowsContainer = this.orderContainer.querySelector('#orderRowsContainer') as HTMLDivElement;

    if (!this.calculatorForm || !this.calculateBtn) {
      return;
    }

    this.calculateBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.calculate();
    });
  }

  private calculate() {
    const productType = document.querySelector('#productType') as HTMLSelectElement;
    const measurement = document.querySelector('#measurement') as HTMLSelectElement;

    const panelsData = this.collectPanelsData();

    console.log(panelsData);
    this.addProductsToOrderForm(panelsData);
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

  private calculateTotalPrice() {
    const discount = this.orderContainer.querySelector('#discount') as HTMLDivElement;
    const totalPrice = this.orderContainer.querySelector('#totalPrice') as HTMLDivElement;
  }

  private updateOutputs(name: string, value: number) {}

  private calculateRegularPrice() {
    const regularPrice = this.orderContainer.querySelector('#regularPrice') as HTMLDivElement;
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

function removeChat() {
  setTimeout(() => {
    const chat = document.querySelector('jdiv');
    if (chat) {
      chat.remove();
    }
  }, 3000);
}
