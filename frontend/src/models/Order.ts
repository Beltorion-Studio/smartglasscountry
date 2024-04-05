import { Product } from './Product';

interface PanelData {
  width: number;
  height: number;
  quantity: number;
}

export class Order {
  private products: Product[] = [];
  private unitOfMeasurement: string;
  private productType: string;

  constructor(panelsData: PanelData[], unitOfMeasurement: string, productType: string) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.productType = productType;
    this.products = panelsData.map((panel) => new Product(panel));
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  // New method to get the list of products
  getProducts(): Product[] {
    return this.products;
  }
}
