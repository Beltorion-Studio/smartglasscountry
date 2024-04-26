export class PricingService {
  //private quotedCurrency: string;
  //private discount: number;
  // private unitPrice: number;
  // private insurance: number;
  //private tax: number;
  // private shipping: number;
  // private totalPrice: number;
  private productType: string;
  private crating: number;
  private static instance: PricingService;

  private constructor(productType: string) {
    this.productType = productType;
    this.crating = this.calculateCrating();
  }

  convertSqftToSqm(areaInSqft: number): number {
    return areaInSqft * 0.09290304;
  }

  calculateShippingCost(): number {
    if (this.productType === 'smartFilm') {
      return 500;
    }
    if (this.productType === 'smartGlass' || this.productType === 'igu') {
      return 1200;
    }
    throw new Error(`Invalid product type: ${this.productType}`);
  }

  calculateTax(): number {
    return 0;
  }

  calculateInsurance(): number {
    if (this.productType === 'smartFilm') {
      return 0.89;
    }
    if (this.productType === 'smartGlass' || this.productType === 'igu') {
      return 90;
    }
    throw new Error(`Invalid product type: ${this.productType}`);
  }

  calculateCrating(): number {
    if (this.productType === 'smartFilm') {
      return 25;
    }
    if (this.productType === 'smartGlass' || this.productType === 'igu') {
      return 200;
    }
    throw new Error(`Invalid product type: ${this.productType}`);
  }

  public static getInstance(productType: string): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService(productType);
    } else {
      // If the instance already exists, but the productType is different, you might need to update it
      PricingService.instance.setProductType(productType);
    }
    return PricingService.instance;
  }

  public setProductType(productType: string): void {
    this.productType = productType;
    // You might also need to reset other properties related to the product type here
  }
}
