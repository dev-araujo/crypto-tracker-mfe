import {
  CoinApiModel,
  CoinDetailApiModel,
  CoinListApiResponse,
  CoinSupplyApiModel,
  MarketStatsApiModel,
  PriceHistoryApiResponse,
} from '../models/coin-api.model';
import {
  Coin,
  CoinDetail,
  CoinLink,
  CoinPage,
  CoinSupply,
  MarketStats,
  PriceHistory,
  PricePoint,
  PriceTrend,
} from '../models/coin.model';

const FLAT_TREND_THRESHOLD = 0.005;

export function toCoin(api: CoinApiModel): Coin {
  const changePercent = toNumber(api.change);

  return {
    uuid: api.uuid,
    symbol: api.symbol,
    name: api.name,
    rank: api.rank,
    iconUrl: api.iconUrl,
    accentColor: api.color,
    price: toNumber(api.price),
    marketCap: toNumber(api.marketCap),
    volume24h: toNumber(api['24hVolume']),
    changePercent,
    trend: toTrend(changePercent),
    sparkline: toSparkline(api.sparkline),
    listedAt: toDate(api.listedAt),
    isLowVolume: api.lowVolume === true,
  };
}

export function toMarketStats(api: MarketStatsApiModel): MarketStats {
  return {
    matchingCoins: api.total ?? 0,
    totalCoins: api.totalCoins ?? 0,
    totalMarkets: api.totalMarkets ?? 0,
    totalExchanges: api.totalExchanges ?? 0,
    totalVolume24h: toNumber(api.total24hVolume),
  };
}

export function toCoinPage(response: CoinListApiResponse): CoinPage {
  return {
    coins: response.data.coins.map(toCoin),
    stats: toMarketStats(response.data.stats),
  };
}

export function toCoinDetail(api: CoinDetailApiModel): CoinDetail {
  return {
    ...toCoin(api),
    description: api.description ?? '',
    websiteUrl: api.websiteUrl,
    links: toLinks(api),
    supply: toSupply(api.supply),
    allTimeHighPrice: toNumber(api.allTimeHigh?.price ?? null),
    allTimeHighAt: toDate(api.allTimeHigh?.timestamp ?? null),
    numberOfMarkets: api.numberOfMarkets,
    numberOfExchanges: api.numberOfExchanges,
    fullyDilutedMarketCap: toNumber(api.fullyDilutedMarketCap),
  };
}

export function toPriceHistory(response: PriceHistoryApiResponse): PriceHistory {
  const points = toChronologicalPoints(response.data.history ?? []);
  const prices = points.map((point) => point.price);
  const changePercent = toNumber(response.data.change);

  return {
    changePercent,
    trend: toTrend(changePercent),
    points,
    lowest: prices.length > 0 ? Math.min(...prices) : null,
    highest: prices.length > 0 ? Math.max(...prices) : null,
  };
}

export function toTrend(changePercent: number | null): PriceTrend {
  if (changePercent === null || Math.abs(changePercent) < FLAT_TREND_THRESHOLD) {
    return 'flat';
  }

  return changePercent > 0 ? 'up' : 'down';
}

function toChronologicalPoints(
  history: PriceHistoryApiResponse['data']['history'],
): readonly PricePoint[] {
  return history
    .map((entry) => ({ price: toNumber(entry.price), timestamp: toDate(entry.timestamp) }))
    .filter((entry): entry is PricePoint => entry.price !== null && entry.timestamp !== null)
    .sort((first, second) => first.timestamp.getTime() - second.timestamp.getTime());
}

function toLinks(api: CoinDetailApiModel): readonly CoinLink[] {
  return (api.links ?? []).map((link) => ({ name: link.name, type: link.type, url: link.url }));
}

function toSupply(api: CoinSupplyApiModel | null): CoinSupply {
  const circulating = toNumber(api?.circulating ?? null);
  const total = toNumber(api?.total ?? null);
  const max = toNumber(api?.max ?? null);
  const reference = max ?? total;

  return {
    circulating,
    total,
    max,
    circulatingRatio:
      circulating !== null && reference !== null && reference > 0 ? circulating / reference : null,
  };
}

function toSparkline(sparkline: (string | null)[] | null): readonly number[] {
  return (sparkline ?? [])
    .map((value) => toNumber(value))
    .filter((value): value is number => value !== null);
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function toDate(value: number | null | undefined): Date | null {
  if (value === null || value === undefined) {
    return null;
  }

  return new Date(value * 1000);
}
