import { TimePeriodCode } from './time-period.model';

export type CoinOrderBy = 'marketCap' | 'price' | 'change' | '24hVolume' | 'listedAt';

export type OrderDirection = 'asc' | 'desc';

export interface CoinQuery {
  readonly currencyUuid: string;
  readonly search: string;
  readonly offset: number;
  readonly limit: number;
  readonly orderBy: CoinOrderBy;
  readonly orderDirection: OrderDirection;
  readonly timePeriod: TimePeriodCode;
}

export interface CoinDetailQuery {
  readonly uuid: string;
  readonly currencyUuid: string;
  readonly timePeriod: TimePeriodCode;
}
