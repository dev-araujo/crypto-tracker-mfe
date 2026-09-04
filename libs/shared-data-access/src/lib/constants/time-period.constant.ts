import { TimePeriod, TimePeriodCode } from '../models/time-period.model';

export const TIME_PERIODS: readonly TimePeriod[] = [
  { code: '24h', label: '24h', description: 'Últimas 24 horas' },
  { code: '7d', label: '7d', description: 'Últimos 7 dias' },
  { code: '30d', label: '30d', description: 'Últimos 30 dias' },
  { code: '1y', label: '1a', description: 'Último ano' },
  { code: '5y', label: '5a', description: 'Últimos 5 anos' },
];

export const DEFAULT_TIME_PERIOD = TIME_PERIODS[0];

export function findTimePeriodByCode(code: string): TimePeriod {
  return TIME_PERIODS.find((period) => period.code === code) ?? DEFAULT_TIME_PERIOD;
}

export function isTimePeriodCode(value: string): value is TimePeriodCode {
  return TIME_PERIODS.some((period) => period.code === value);
}
