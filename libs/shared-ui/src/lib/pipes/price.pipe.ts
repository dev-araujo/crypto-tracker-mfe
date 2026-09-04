import { Pipe, PipeTransform } from '@angular/core';
import { formatCompactCurrency, formatCurrency } from '@crypto/shared-utils';

@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined, currencyCode: string, compact = false): string {
    return compact
      ? formatCompactCurrency(value, currencyCode)
      : formatCurrency(value, currencyCode);
  }
}
