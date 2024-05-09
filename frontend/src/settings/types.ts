 type Product = {
  width: number;
  height: number;
  quantity: number;
  productType: string;
  squareFootage: number;
  squarMeterage: number;
  size: number;
  totalPrice: number;
  unitPrice: number;
  insurancePercentage: number;
  shippingCost: number;
  unitOfMeasurement: string;
};

 type OrderData = {
  products: Product[];
  discount: string;
  unitOfMeasurement: string;
  productType: string;
  totalRegularPrice: number;
  discountAmount: number;
  totalFinalPrice: number;
  quotedCurrency: string;
  cratingCost: number;
  insuranceCost: number;
  tax: number;
  shippingCost: number;
  subTotal: number;
  discountPeriod: number;
  minOrderQuantity: number;
};

 type PanelData ={
  width: number;
  height: number;
  quantity: number;
}

 type OrderResponse= {
  redirectUrl?: string;
  orderToken?: string;
  error?: string;
}

 type UrlParams = {
  country?: string;
};

export type {OrderData, PanelData, OrderResponse, UrlParams}