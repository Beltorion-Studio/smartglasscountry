export class Product {
  public width: number;
  public height: number;
  public quantity: number;
  public productType: string;
  public squareFootage: number;
  public squarMeterage: number;
  public squaredMeasurement: number;
  public totalPrice: number;
  public unitPrice: number;
  public unitOfMeasurement: string;

  constructor(
    width: number,
    height: number,
    quantity: number,
    unitOfMeasurement: string,
    productType: string,
    unitPrice: number
  ) {
    this.productType = productType;
    this.unitPrice = unitPrice;
    this.width = width;
    this.height = height;
    this.quantity = quantity;
    this.unitOfMeasurement = unitOfMeasurement;

    if (this.unitOfMeasurement === 'inches') {
      this.squaredMeasurement = this.getSquareFootage();
    } else {
      this.squaredMeasurement = this.getSquareMeterage();
    }

    if (
      isNaN(this.width) ||
      isNaN(this.height) ||
      isNaN(this.quantity) ||
      this.width <= 0 ||
      this.height <= 0 ||
      this.quantity <= 0
    ) {
      throw new Error(
        'Invalid product dimensions or quantity. All values must be positive numbers.'
      );
    }

    // Calculate square footage and total price
    this.squareFootage = this.getSquareFootage();
    this.squarMeterage = this.getSquareMeterage();
    this.totalPrice = this.getTotalPrice();
  }

  private getSquareFootage(): number {
    const squareFootage = (this.width * this.height) / 144;
    return Number(squareFootage.toFixed(2));
  }

  private getSquareMeterage(): number {
    const squareMeterage = (this.width * this.height) / 1000000;
    return Number(squareMeterage.toFixed(2));
  }

  getTotalPrice(): number {
    let totalPrice = this.squaredMeasurement * Number(this.quantity) * Number(this.unitPrice);

    if (this.unitOfMeasurement === 'mm') {
      totalPrice = totalPrice * 10.7639;
    }

    return Number(totalPrice.toFixed(2));
  }
}
