import { Product } from './Product';

interface PanelData {
  width: number;
  height: number;
  quantity: number;
}

export class Order {
  private products: Product[] = [];
  private discount: number = 0.22;
  private unitOfMeasurement: string;

  constructor(panelsData: PanelData[], unitOfMeasurement: string) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.products = panelsData.map((panel) => new Product(panel, this.unitOfMeasurement));
  }

  addProduct(product: Product): void {
    this.products.push(product);
  }

  setDiscount(discountValue: number): void {
    this.discount = discountValue;
  }

  calculateTotalRegularPrice(): number {
    return this.products.reduce((sum, product) => sum + product.getTotalPrice(), 0);
  }

  calculateDiscount(): number {
    return this.calculateTotalRegularPrice() * this.discount;
  }

  calculateTotalFinalPrice(): number {
    const regularPrice = this.calculateTotalRegularPrice();
    return regularPrice - this.calculateDiscount();
  }

  // New method to get the list of products
  getProducts(): Product[] {
    return this.products;
  }
}
