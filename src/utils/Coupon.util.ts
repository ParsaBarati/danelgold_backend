export function calculateDiscountedTotalPrice(
    sumPrice: number,
    discountValue: number,
  ): number {
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      console.error(`Invalid discount percentage: ${discountValue}`);
      return sumPrice;
    }
    
    const discountAmount = (discountValue / 100) * sumPrice;
    return sumPrice - discountAmount;
  }
  