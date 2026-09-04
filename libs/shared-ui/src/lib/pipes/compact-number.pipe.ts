import { Pipe, PipeTransform } from '@angular/core';
import { formatCompactNumber } from '@crypto/shared-utils';

@Pipe({ name: 'compactNumber' })
export class CompactNumberPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatCompactNumber(value);
  }
}
