export type TimePeriodCode = '1h' | '24h' | '7d' | '30d' | '1y' | '5y';

export interface TimePeriod {
  readonly code: TimePeriodCode;
  readonly label: string;
  readonly description: string;
}
