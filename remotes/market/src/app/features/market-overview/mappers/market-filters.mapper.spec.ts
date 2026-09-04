import { DEFAULT_MARKET_FILTERS } from '../constants/market.constant';
import { mapFiltersToRouteParams, mapRouteParamsToFilters } from './market-filters.mapper';

describe('mapRouteParamsToFilters', () => {
  it('falls back to defaults when params are missing', () => {
    expect(mapRouteParamsToFilters({})).toEqual(DEFAULT_MARKET_FILTERS);
  });

  it('parses supported values', () => {
    const filters = mapRouteParamsToFilters({
      search: '  btc ',
      offset: '50',
      limit: '10',
      orderBy: 'price',
      direction: 'asc',
      period: '7d',
    });

    expect(filters).toEqual({
      search: 'btc',
      offset: 50,
      limit: 10,
      orderBy: 'price',
      orderDirection: 'asc',
      timePeriod: '7d',
    });
  });

  it('rejects unsupported values', () => {
    const filters = mapRouteParamsToFilters({
      offset: '-5',
      limit: '17',
      orderBy: 'dropTable',
      direction: 'sideways',
      period: '3h',
    });

    expect(filters.offset).toBe(DEFAULT_MARKET_FILTERS.offset);
    expect(filters.limit).toBe(DEFAULT_MARKET_FILTERS.limit);
    expect(filters.orderBy).toBe(DEFAULT_MARKET_FILTERS.orderBy);
    expect(filters.orderDirection).toBe(DEFAULT_MARKET_FILTERS.orderDirection);
    expect(filters.timePeriod).toBe(DEFAULT_MARKET_FILTERS.timePeriod);
  });
});

describe('mapFiltersToRouteParams', () => {
  it('omits default values so the url stays clean', () => {
    expect(mapFiltersToRouteParams(DEFAULT_MARKET_FILTERS)).toEqual({
      search: null,
      offset: null,
      limit: null,
      orderBy: null,
      direction: null,
      period: null,
    });
  });

  it('serialises non default values', () => {
    const params = mapFiltersToRouteParams({
      ...DEFAULT_MARKET_FILTERS,
      search: 'eth',
      offset: 25,
      timePeriod: '30d',
    });

    expect(params).toMatchObject({ search: 'eth', offset: '25', period: '30d' });
  });
});
