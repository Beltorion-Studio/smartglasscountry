import { Order } from '../models/Order';
import { cloneNode } from '@finsweet/ts-utils';
import { ErrorMessageUI } from './ErrorMessageUI';
import { ApiServices } from 'src/services/ApiServices';
import {globalSettings} from 'src/settings/globalSettings';
/*

export class DisplayOrders {
  private orderContainer: HTMLDivElement;
  private orderRowsContainer: HTMLDivElement;
  private orderRows: HTMLDivElement[] = [];
  private totalprice: HTMLDivElement;
  private regularPrice: HTMLDivElement;
  private discount: HTMLDivElement;
  private discountValue: HTMLElement;
  private orderService: ApiServices;
  private dashboardData!: Record<string, string>;

  constructor() {
    this.orderContainer = document.querySelector('#orderContainer') as HTMLDivElement;
    this.orderRowsContainer = this.orderContainer.querySelector(
      '#orderRowsContainer'
    ) as HTMLDivElement;
    this.regularPrice = document.querySelector('#regularPrice') as HTMLDivElement;
    this.totalprice = document.querySelector('#totalPrice') as HTMLDivElement;
    this.discount = document.querySelector('#discount') as HTMLDivElement;
    this.discountValue = document.querySelector("[bo-elements='discount-value']") as HTMLElement;
    this.orderService = new ApiServices(globalSettings.orderUrl);

    this.addProductsToOrderForm().catch((error) => {
      console.error('Error adding products to order form:', error);
      //ErrorMessageUI.show('Failed to load products.');
    });
  }

  private async addProductsToOrderForm(): Promise<void> {
    const orderRow = this.orderRowsContainer.querySelector("[bo-elements='order-row']") as HTMLDivElement;
    orderRow.querySelectorAll('div[data-order]').forEach((div) => {
      div.textContent = '';
    });
    this.orderRowsContainer.innerHTML = '';
    let orderToken = this.getOrderToken();
    console.log(orderToken);
    const params = { orderToken: orderToken };
    const products = await this.fetchOrder(params);
    console.log(products);

    if (!products) {
     // ErrorMessageUI.show('No products in order');
      return;
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

  private getOrderToken(): string | null {
    return sessionStorage.getItem('orderToken');
  }

  async fetchOrder(): Promise<Record<string, string>> {
    const orderToken = this.getOrderToken();
    const params = {
      orderToken: orderToken,
    };  
    const responseData = await this.orderService.fetchDataWithParams(params);
    return responseData;
  }

  updateOrderTable(orderData: any): void {
    this.regularPrice.textContent = '$' + String(orderData.TotalRegularPrice.toFixed(2));
    this.totalprice.textContent = '$' + String(orderData.TotalFinalPrice.toFixed(2));
    this.discount.textContent = '$' + String(orderData.DiscountAmount.toFixed(2));
    this.discountValue.textContent = String(orderData.discount);
  }

  private convertToInches(value: string): string {
    return (parseFloat(value) / 25.4).toFixed(2);
  }


}
*/