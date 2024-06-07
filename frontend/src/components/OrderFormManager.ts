import { cloneNode } from '@finsweet/ts-utils';

export class OrderFormManager {
  private orderContainers: HTMLDivElement[];
  private orderRowsContainers: HTMLDivElement[];

  constructor(orderContainers: HTMLDivElement[], orderRowsContainers: HTMLDivElement[]) {
    this.orderContainers = orderContainers;
    this.orderRowsContainers = orderRowsContainers;
  }

  private clearOrderRows(orderRows: HTMLDivElement[]) {
    orderRows.forEach((orderRow) => {
      orderRow.querySelectorAll('div[data-order]').forEach((div) => {
        div.textContent = '';
      });
    });
  }

  private clearOrderRowsContainers(orderRowsContainers: HTMLDivElement[]) {
    orderRowsContainers.forEach((orderRow) => {
      orderRow.innerHTML = '';
    });
  }

  private setCellContent(
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

  private createAndAppendNewRows(orderRows: HTMLDivElement[], orderData: any) {
    const products = orderData.products;
    products.forEach((product: any) => {
      orderRows.forEach((orderRow, index: number) => {
        const newRow = cloneNode(orderRow);
        Object.keys(product).forEach((key) => {
          this.formatProductName(product, key);
          const cell = newRow.querySelector(`[data-order="${key}"]`) as
            | HTMLDivElement
            | HTMLInputElement;
          if (cell) {
            this.setCellContent(cell, key, product, orderData);
          }
        });
        this.orderRowsContainers[index].appendChild(newRow);
      });
    });
  }

  public addProductsToOrderForm(orderData: any): void {
    const orderRows = Array.from(this.orderContainers, (container) => {
      return container.querySelector("[bo-elements='order-row']");
    }) as HTMLDivElement[];
    this.clearOrderRows(orderRows);
    this.clearOrderRowsContainers(this.orderRowsContainers);
    this.createAndAppendNewRows(orderRows, orderData);
  }

  private formatProductName(product: any, key: string) {
    if (product[key] === 'smartFilm') {
      product[key] = 'Smart Film';
    } else if (product[key] === 'smartGlass') {
      product[key] = 'Smart Glass';
    } else if (product[key] === 'igu') {
      product[key] = 'IGU';
    }
  }
}
