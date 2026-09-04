import { APP_LOCALE, EMPTY_VALUE } from '../constants/locale.constant';

export function formatPercent(value: number | null | undefined, fractionDigits = 2): string {
  if (!isPresent(value)) {
    return EMPTY_VALUE;
  }

  const formatted = new Intl.NumberFormat(APP_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    signDisplay: 'exceptZero',
  }).format(value);

  return `${formatted}%`;
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (!isPresent(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(APP_LOCALE, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatInteger(value: number | null | undefined): string {
  if (!isPresent(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(APP_LOCALE, { maximumFractionDigits: 0 }).format(value);
}

export function formatDecimal(value: number | null | undefined, fractionDigits = 2): string {
  if (!isPresent(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(APP_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function isPresent(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && Number.isFinite(value);
}
