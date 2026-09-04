import { APP_LOCALE, EMPTY_VALUE } from '../constants/locale.constant';

export function formatDate(value: Date | null | undefined): string {
  if (!isValidDate(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(APP_LOCALE, { dateStyle: 'medium' }).format(value);
}

export function formatDateTime(value: Date | null | undefined): string {
  if (!isValidDate(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(APP_LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value);
}

export function formatTime(value: Date | null | undefined): string {
  if (!isValidDate(value)) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(APP_LOCALE, { timeStyle: 'short' }).format(value);
}

export function formatElapsedSeconds(seconds: number): string {
  if (seconds < 60) {
    return `há ${Math.max(seconds, 0)}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `há ${minutes}min`;
  }

  return `há ${Math.floor(minutes / 60)}h`;
}

function isValidDate(value: Date | null | undefined): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
