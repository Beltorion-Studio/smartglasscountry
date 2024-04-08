export class ProductParameters {
  discountAvailabilityPeriod: Date[];
  pricePerSquareFoot: number;
  maxDimensions: { width: number; height: number };

  constructor() {
    this.discountAvailabilityPeriod = [new Date()];
    this.pricePerSquareFoot = 0;
    this.maxDimensions = { width: 0, height: 0 };
  }

  calculateArea(): number {
    return this.maxDimensions.width * this.maxDimensions.height;
  }
}
