import type { Price } from '@core/model/product';
import { isNotNullable } from '@utils/not-nullable';

function formatCentAmount(price: Price): string {
  return (price.value.centAmount / 10 ** price.value.fractionDigits).toFixed(price.value.fractionDigits);
}

function formatDiscount(price: Price): string {
  if (isNotNullable(price.discounted)) {
    return `${(price.discounted.value.centAmount / 10 ** price.discounted?.value.fractionDigits).toFixed(price.value.fractionDigits)}`;
  }
  return '';
}

export { formatCentAmount, formatDiscount };
