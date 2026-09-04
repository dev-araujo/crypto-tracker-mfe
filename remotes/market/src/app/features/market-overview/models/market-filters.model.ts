import { CoinOrderBy, OrderDirection, TimePeriodCode } from '@crypto/shared-data-access';

export interface MarketFilters {
  readonly search: string;
  readonly offset: number;
  readonly limit: number;
  readonly orderBy: CoinOrderBy;
  readonly orderDirection: OrderDirection;
  readonly timePeriod: TimePeriodCode;
}

export interface MarketRouteParams {
  readonly search?: string;
  readonly offset?: string;
  readonly limit?: string;
  readonly orderBy?: string;
  readonly direction?: string;
  readonly period?: string;
}

export type MarketStatus = 'loading' | 'refreshing' | 'ready' | 'error';
