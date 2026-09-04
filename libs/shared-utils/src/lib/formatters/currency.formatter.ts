import { APP_LOCALE, EMPTY_VALUE } from '../constants/locale.constant';
import { isPresent } from './number.formatter';

const CENT_THRESHOLD = 1;
const SUB_CENT_THRESHOLD = 0.01;
const STANDARD_DIGITS = 2;
const EXTENDED_DIGITS = 4;
const MICRO_DIGITS = 8;

export function formatCurrency(value: number | null | undefined, currencyCode: string): string {
  if (!isPresent(value)) {
    return EMPTY_VALUE;
  }

  const fractionDigits = resolveFractionDigits(value);

  return new Intl.NumberFormat(APP_LOCALE, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCompactCurrency(
  value: number | null | undefined,
  currencyCode: string,
): string {
  if (!isPresent(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(APP_LOCALE, {
    style: 'currency',
    currency: currencyCode,
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

function resolveFractionDigits(value: number): number {
  const magnitude = Math.abs(value);

  if (magnitude >= CENT_THRESHOLD || magnitude === 0) {
    return STANDARD_DIGITS;
  }

  if (magnitude >= SUB_CENT_THRESHOLD) {
    return EXTENDED_DIGITS;
  }

  return MICRO_DIGITS;
}
