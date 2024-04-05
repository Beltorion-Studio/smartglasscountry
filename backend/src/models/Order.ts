import { Product } from './Product';

export class Order {
  private products: Product[] = [];
  private discount: number = 0.22;
  private unitOfMeasurement: string;
  private productType: string;
  private TotalRegularPrice: number = 0;
  private DiscountAmount: number = 0;
  private TotalFinalPrice: number = 0;

  constructor(unitOfMeasurement: string, productType: string) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.productType = productType;
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

  calculatePrices(): void {
    this.TotalRegularPrice = this.calculateTotalRegularPrice();
    this.DiscountAmount = this.calculateDiscount();
    this.TotalFinalPrice = this.calculateTotalFinalPrice();
  }
}
