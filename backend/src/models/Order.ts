import { PricingService } from '../services/PricingService';
import { Product } from './Product';

export class Order {
  private products: Product[] = [];
  private discount: number;
  private unitOfMeasurement: string;
  private productType: string;
  private totalRegularPrice: number = 0;
  private discountAmount: number = 0;
  private totalFinalPrice: number = 0;
  private quotedCurrency: string = 'USD';
  private cratingCost: number = 0;
  private insuranceCost: number = 0;
  private tax: number = 0;
  private shippingCost: number = 0;
  private subtotal: number = 0;
  private finalPrice: number = 0;

  constructor(unitOfMeasurement: string, productType: string, discount: number = 0) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.productType = productType;
    this.discount = discount;
    const pricingService = PricingService.getInstance(this.productType);
    pricingService.setProductType(this.productType); // Assuming such a method exists
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
  /*
  calculateDiscount(price): number {
    return price * this.discount * 0.01;
  }
*/
  calculateDiscount(price: number): number {
    return price * this.discount * 0.01;
  }

  calculateTotalFinalPrice(): void {
    const pricingService = PricingService.getInstance(this.productType);
    this.subtotal = this.calculateTotalRegularPrice();
    this.shippingCost = pricingService.calculateShippingCost();
    this.insuranceCost = pricingService.calculateInsurance();
    this.cratingCost = pricingService.calculateCrating();
    this.finalPrice = this.subtotal + this.shippingCost + this.insuranceCost + this.cratingCost;
    this.discountAmount = this.calculateDiscount(this.finalPrice);
    this.totalFinalPrice = this.finalPrice - this.discountAmount;

    // return totalFinalPrice;
  }

  calculateReviewPrice(): void {
    this.totalRegularPrice = this.calculateTotalRegularPrice();
    this.discountAmount = this.calculateDiscount(this.totalRegularPrice);
    this.totalFinalPrice = this.totalRegularPrice - this.discountAmount;
  }

  // New method to get the list of products
  getProducts(): Product[] {
    return this.products;
  }
}
