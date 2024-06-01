import { z } from 'zod';

import { formSchema } from '../models/contactFormSchema';

type Bindings = {
  DASHBOARD_SETTINGS: KVNamespace;
  PRODUCT_SETTINGS: KVNamespace;
  SESSION_STORAGE: KVNamespace;
  USERNAME: string;
  PASSWORD: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_CLIENT: string;
};

type FormData = z.infer<typeof formSchema>;

type ProductData = {
  width: number;
  height: number;
  quantity: number;
  productType: string;
  squareFootage: number;
};

type Payload = {
  [orderToken: string]: {
    formData: Omit<FormData, 'orderToken'>;
    orderDetails: {
      products: Pick<ProductData, 'width' | 'height' | 'quantity'>[];
      productType: string;
      totalsqft: number;
      totalRegularPrice: number;
    };
  };
};

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

type Order = {
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

export { Bindings, FormData, Order, Payload, Product };
