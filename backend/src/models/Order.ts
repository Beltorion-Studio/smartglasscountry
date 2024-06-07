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
  private subTotal: number = 0;
  private discountPeriod: number;
  private minOrderQuantity: number;

  constructor(
    unitOfMeasurement: string,
    productType: string,
    discount: number = 0,
    discountPeriod: number,
    minOrderQuantity: number,
    cratingCost: number
  ) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.productType = productType;
    this.discount = discount;
    this.discountPeriod = discountPeriod;
    this.minOrderQuantity = minOrderQuantity;
    this.cratingCost = cratingCost;
    const pricingService = PricingService.getInstance(this.productType);
    pricingService.setProductType(this.productType);
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
  calculateInsurance(): number {
    return this.products.reduce((sum, product) => sum + product.getInsuranceCost(), 0);
  }
  calculateShippingCost(): number {
    if (this.products.length > 0) {
      return this.products[0].shippingCost;
    }
    return 0;
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
    // const pricingService = PricingService.getInstance(this.productType);
    this.totalRegularPrice = this.calculateTotalRegularPrice();
    this.shippingCost = this.calculateShippingCost();
    this.insuranceCost = this.calculateInsurance();
    this.cratingCost = this.cratingCost;
    this.subTotal =
      this.shippingCost + this.insuranceCost + this.cratingCost + this.totalRegularPrice;
    this.discountAmount = this.calculateDiscount(this.totalRegularPrice);
    this.totalFinalPrice = this.subTotal - this.discountAmount;

    // return totalFinalPrice;
  }
  /*
  calculateReviewPrice(): void {
    this.totalRegularPrice = this.calculateTotalRegularPrice();
    this.discountAmount = this.calculateDiscount(this.totalRegularPrice);
    this.totalFinalPrice = this.totalRegularPrice - this.discountAmount;
  }
*/
  // New method to get the list of products
  getProducts(): Product[] {
    return this.products;
  }
}
