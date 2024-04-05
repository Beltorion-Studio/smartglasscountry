export class Product {
  public width: number;
  public height: number;
  public quantity: number;
  public productType: string;

  constructor(
    productData: { width: number; height: number; quantity: number }
   
  ) {
    this.productType = 'Smart Film';
    this.width = productData.width;
    this.height = productData.height;
    this.quantity = productData.quantity;


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
  }

}
