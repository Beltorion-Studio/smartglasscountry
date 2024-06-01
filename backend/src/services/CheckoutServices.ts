import stripe from 'stripe';

export class CheckoutServices {
  async createUniqueCoupon(
    stripeClient: stripe,
    discountPercent: number
  ): Promise<stripe.Coupon | null> {
    try {
      const coupon = await stripeClient.coupons.create({
        amount_off: discountPercent,
        currency: 'usd',
        duration: 'once',
      });
      return coupon;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  formatProductName(product: string, size?: number, unitOfMeasurement?: string): string {
    let formattedName = product;
    if (product === 'smartFilm') {
      formattedName = 'Smart Film';
    }
    if (product === 'smartGlass') {
      formattedName = 'Smart Glass';
    }
    if (product === 'igu') {
      formattedName = 'IGU';
    }
    // Append size and the appropriate unit of measurement to the product name if available
    if (size && unitOfMeasurement) {
      const unit = unitOfMeasurement === 'mm' ? 'SQM' : 'SQFT';
      formattedName += ` (${size} ${unit})`;
    }
    return formattedName;
  }
}
