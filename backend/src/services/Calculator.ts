// src/services/Calculator.ts
import { Order } from '../models/Order';
import { Product } from '../models/Product';


export class Calculator {
  calculateProductPrice(product: Product, unitPrice: number): number {
    return product.getTotalPrice();
  }

  convertSqftToSqm(areaInSqft: number): number {
    return areaInSqft * 0.09290304;
  }

  calculateOrderPrices(order: Order): { regularPrice: number; finalPrice: number; discount: number } {
    const regularPrice = order.calculateTotalRegularPrice();
    const discount = order.calculateDiscount();
    const finalPrice = order.calculateTotalFinalPrice();
    return { regularPrice, finalPrice, discount };
  }
}