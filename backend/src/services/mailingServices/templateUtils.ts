function calculateRemainingBalanceAfterDeposit(
  depositAmount: number,
  totalFinalPrice: number
): string {
  return (totalFinalPrice - depositAmount).toFixed(2);
}

export { calculateRemainingBalanceAfterDeposit };
