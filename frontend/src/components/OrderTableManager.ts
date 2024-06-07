export class OrderTableManager {
  public updateOrderTable(orderData: any): void {
    const orderTablePrices = document.querySelectorAll(
      '[data-order-details]'
    ) as NodeListOf<HTMLDivElement>;

    orderTablePrices.forEach((element) => {
      const detailKey = element.getAttribute('data-order-details');
      if (detailKey && orderData.hasOwnProperty(detailKey)) {
        const value = orderData[detailKey] as string | number;
        this.updateElementText(element, value, detailKey);
      }
    });
  }

  private updateElementText(element: HTMLDivElement, value: string | number, key: string): void {
    if (typeof value === 'number' || typeof value === 'string') {
      if (typeof value === 'number') {
        this.updateElementWithNumber(element, value, key);
      } else if (typeof value === 'string') {
        this.updateElementWithString(element, value, key);
      }
    } else {
      throw new Error('Invalid value type');
    }
  }

  private updateElementWithNumber(element: HTMLDivElement, value: number, key: string): void {
    if (key === 'discountAmount') {
      element.textContent = `-$${Math.abs(value).toFixed(2)}`;
    } else if (key === 'discountPeriod' || key === 'discount') {
      element.textContent = `${value.toString()}`;
    } else {
      element.textContent = `$${value.toFixed(2)}`;
    }
  }

  private updateElementWithString(element: HTMLDivElement, value: string, key: string): void {
    if (key === 'productType') {
      const productTypes: { [key: string]: string } = {
        smartFilm: 'Smart Film',
        smartGlass: 'Smart Glass',
        igu: 'IGU',
      };
      element.textContent = productTypes[value] || '';
    }
  }
}
