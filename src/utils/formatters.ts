import type { LineItem } from '@core/model/cart';
import type { Price } from '@core/model/product';
import { isNotNullable } from '@utils/not-nullable';

function formatCentAmount(...prices: Price[]): string {
  if (prices.length === 0) return '0';
  let total: number = 0;
  const maxFractionDigits = Math.max(...prices.map((p) => p.value.fractionDigits));
  for (const price of prices) {
    const diff: number = maxFractionDigits - price.value.fractionDigits;
    total += price.value.centAmount * 10 ** diff;
  }
  return (total / 10 ** maxFractionDigits).toFixed(maxFractionDigits);
}

function formatCentAmountLineItem(...prices: LineItem[]): string {
  if (prices.length === 0) return '0';
  let total: number = 0;
  const maxFractionDigits: number = Math.max(...prices.map((p) => p.totalPrice.fractionDigits));
  for (const price of prices) {
    const diff: number = maxFractionDigits - price.totalPrice.fractionDigits;
    total += price.totalPrice.centAmount * 10 ** diff;
  }
  return (total / 10 ** maxFractionDigits).toFixed(maxFractionDigits);
}

function formatDiscount(price: Price): string {
  if (isNotNullable(price.discounted)) {
    return `${(price.discounted.value.centAmount / 10 ** price.discounted?.value.fractionDigits).toFixed(price.value.fractionDigits)}`;
  }
  return '';
}

export { formatCentAmount, formatDiscount, formatCentAmountLineItem };
