import { CoinOrderBy } from '@crypto/shared-data-access';
import { MarketFilters } from '../models/market-filters.model';

export const DEFAULT_MARKET_FILTERS: MarketFilters = {
  search: '',
  offset: 0,
  limit: 25,
  orderBy: 'marketCap',
  orderDirection: 'desc',
  timePeriod: '24h',
};

export const MARKET_PAGE_SIZES: readonly number[] = [10, 25, 50];

export interface MarketColumn {
  readonly label: string;
  readonly orderBy: CoinOrderBy | null;
  readonly modifier: string;
}

export const MARKET_COLUMNS: readonly MarketColumn[] = [
  { label: 'Cripto', orderBy: null, modifier: 'identity' },
  { label: 'Preço', orderBy: 'price', modifier: 'price' },
  { label: 'Variação', orderBy: 'change', modifier: 'change' },
  { label: 'Volume 24h', orderBy: '24hVolume', modifier: 'volume' },
  { label: 'Cap. de mercado', orderBy: 'marketCap', modifier: 'cap' },
  { label: 'Tendência', orderBy: null, modifier: 'trend' },
];
