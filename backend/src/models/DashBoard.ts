export class Dashboard {
  public discount: number;
  public salesforceApiKey: string;
  public parameters: {
    smartFilm: ProductParameters;
    smartGlass: ProductParameters;
    igu: ProductParameters;
  };

  constructor(
    discount: number,
    salesforceApiKey: string,
    parameters: {
      smartFilm: ProductParameters;
      smartGlass: ProductParameters;
      igu: ProductParameters;
    }
  ) {
    this.discount = discount;
    this.salesforceApiKey = salesforceApiKey;
    this.parameters = parameters;
  }
}
