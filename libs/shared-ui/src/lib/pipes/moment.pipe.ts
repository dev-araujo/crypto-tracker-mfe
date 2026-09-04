import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, formatDateTime } from '@crypto/shared-utils';

@Pipe({ name: 'moment' })
export class MomentPipe implements PipeTransform {
  transform(value: Date | null | undefined, withTime = false): string {
    return withTime ? formatDateTime(value) : formatDate(value);
  }
}
