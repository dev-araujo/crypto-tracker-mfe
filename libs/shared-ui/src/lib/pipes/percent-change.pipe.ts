import { Pipe, PipeTransform } from '@angular/core';
import { formatPercent } from '@crypto/shared-utils';

@Pipe({ name: 'percentChange' })
export class PercentChangePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatPercent(value);
  }
}
