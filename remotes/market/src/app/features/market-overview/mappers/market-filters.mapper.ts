import { CoinOrderBy, OrderDirection, isTimePeriodCode } from '@crypto/shared-data-access';
import { DEFAULT_MARKET_FILTERS, MARKET_PAGE_SIZES } from '../constants/market.constant';
import { MarketFilters, MarketRouteParams } from '../models/market-filters.model';

const ORDER_BY_VALUES: readonly CoinOrderBy[] = [
  'marketCap',
  'price',
  'change',
  '24hVolume',
  'listedAt',
];

export function mapRouteParamsToFilters(params: MarketRouteParams): MarketFilters {
  return {
    search: (params.search ?? DEFAULT_MARKET_FILTERS.search).trim(),
    offset: toPositiveInteger(params.offset, DEFAULT_MARKET_FILTERS.offset),
    limit: toPageSize(params.limit),
    orderBy: toOrderBy(params.orderBy),
    orderDirection: toOrderDirection(params.direction),
    timePeriod:
      params.period !== undefined && isTimePeriodCode(params.period)
        ? params.period
        : DEFAULT_MARKET_FILTERS.timePeriod,
  };
}

export function mapFiltersToRouteParams(filters: MarketFilters): Record<string, string | null> {
  return {
    search: filters.search.length > 0 ? filters.search : null,
    offset: filters.offset > 0 ? String(filters.offset) : null,
    limit: filters.limit === DEFAULT_MARKET_FILTERS.limit ? null : String(filters.limit),
    orderBy: filters.orderBy === DEFAULT_MARKET_FILTERS.orderBy ? null : filters.orderBy,
    direction:
      filters.orderDirection === DEFAULT_MARKET_FILTERS.orderDirection
        ? null
        : filters.orderDirection,
    period: filters.timePeriod === DEFAULT_MARKET_FILTERS.timePeriod ? null : filters.timePeriod,
  };
}

function toPositiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback;
}

function toPageSize(value: string | undefined): number {
  const parsed = Number(value);

  return MARKET_PAGE_SIZES.includes(parsed) ? parsed : DEFAULT_MARKET_FILTERS.limit;
}

function toOrderBy(value: string | undefined): CoinOrderBy {
  return ORDER_BY_VALUES.find((orderBy) => orderBy === value) ?? DEFAULT_MARKET_FILTERS.orderBy;
}

function toOrderDirection(value: string | undefined): OrderDirection {
  return value === 'asc' || value === 'desc' ? value : DEFAULT_MARKET_FILTERS.orderDirection;
}
