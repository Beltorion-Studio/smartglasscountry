import { Product } from './Product';

type PanelData = {
  width: number;
  height: number;
  quantity: number;
};

export class Order {
  private products: Product[] = [];
  private unitOfMeasurement: string;
  private productType: string;
  private isNewOrder: boolean;

  constructor(
    panelsData: PanelData[],
    unitOfMeasurement: string,
    productType: string,
    isNewOrder: boolean
  ) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.productType = productType;
    this.products = panelsData.map((panel) => new Product(panel));
    this.isNewOrder = isNewOrder;
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  // New method to get the list of products
  getProducts(): Product[] {
    return this.products;
  }
}
