import { Product } from './Product';
export class Order {
  private products: Product[] = [];
  private discount: number;
  private unitOfMeasurement: string;
  private productType: string;
  private TotalRegularPrice: number = 0;
  private DiscountAmount: number = 0;
  private TotalFinalPrice: number = 0;
  constructor(unitOfMeasurement: string, productType: string, discount: number = 0) {
    this.unitOfMeasurement = unitOfMeasurement;
    this.productType = productType;
    this.discount = discount;
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
    return this.calculateTotalRegularPrice() * this.discount * 0.01;
  }
  calculateTotalFinalPrice(): number {
    const regularPrice = this.calculateTotalRegularPrice();
    return regularPrice - this.calculateDiscount();
  }
  getProducts(): Product[] {
    return this.products;
  }
  calculatePrices(): void {
    this.TotalRegularPrice = this.calculateTotalRegularPrice();
    this.DiscountAmount = this.calculateDiscount();
    this.TotalFinalPrice = this.calculateTotalFinalPrice();
  }
}

/*
      export class Calculator { private systemOfMeasurement: string; private quotedCurrency: string; private productType: string; private crating: number; private discount: number; private unitPrice: number; private insurance: number; private tax: number; private shipping: number; private totalPrice: number;  constructor(systemOfMeasurement: string, quotedCurrency: string, productType: string) {  this.systemOfMeasurement = systemOfMeasurement;  this.quotedCurrency = quotedCurrency;  this.productType = productType; }  calculateProductPrice(product: Product, unitPrice: number): number {  return product.getTotalPrice(); }  convertSqftToSqm(areaInSqft: number): number {  return areaInSqft * 0.09290304; }  calculateShippingCost(): number {  if (this.productType === 'smartFilm') {   return 500;  }  if (this.productType === 'smartGlass' || this.productType === 'igu') {   return 1200;  }  throw new Error(Invalid product type: ${this.productType}); }  calculateTax(): number {  return 0; }  calculateInsurance(): number {  if (this.productType === 'smartFilm') {   return 0.89;  }  if (this.productType === 'smartGlass' || this.productType === 'igu') {   return 90;  }  throw new Error(Invalid product type: ${this.productType}); }  calculateCrating(): number {  if (this.productType === 'smartFilm') {   return 25;  }  if (this.productType === 'smartGlass' || this.productType === 'igu') {   return 200;  }  throw new Error(Invalid product type: ${this.productType}); }  calculateOrderPrices(order: Order): {  regularPrice: number;  finalPrice: number;  discount: number; } {  const regularPrice = order.calculateTotalRegularPrice();  const discount = order.calculateDiscount();  const finalPrice = order.calculateTotalFinalPrice();  return { regularPrice, finalPrice, discount }; } }
*/
