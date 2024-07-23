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
  DB: D1Database;
  ADMIN_PASSWORD: string;
  ADMIN_EMAIL: string;
};

type FormData = z.infer<typeof formSchema>;
type ProductData = {
  productType: string;
  width: number;
  height: number;
  quantity: number;
};

type OrderFormData = {
  products: Product[];
  unitOfMeasurement: string;
  productType: string;
  isNewOrder: boolean;
};

type ExtendedProductData = ProductData & {
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
  insurancePercentage?: number;
  shippingCost?: number;
  unitOfMeasurement: string;
};

type OrderData = {
  products: Product[];
  discount: number;
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
  isNewOrder: boolean;
  isUsaOrCanada: boolean;
};

type DashboardData = {
  discount: string;
  smartFilmDiscountPeriod: string;
  smartFilmPrice: string;
  smartFilmMinOrder: string;
  smartFilmShipping: string;
  smartFilmInsurance: string;
  smartFilmCrating: string;
  smartGlassDiscountPeriod: string;
  smartGlassPrice: string;
  smartGlassMinOrder: string;
  smartGlassShipping: string;
  smartGlassInsurance: string;
  smartGlassCrating: string;
  iguDiscountPeriod: string;
  iguPrice: string;
  iguMinOrder: string;
  iguShipping: string;
  iguInsurance: string;
  iguCrating: string;
  apiKey: string;
};

export {
  Bindings,
  DashboardData,
  ExtendedProductData,
  FormData,
  OrderData,
  OrderFormData,
  Payload,
  Product,
  ProductData,
};
