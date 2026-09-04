export type PriceTrend = 'up' | 'down' | 'flat';

export interface Coin {
  readonly uuid: string;
  readonly symbol: string;
  readonly name: string;
  readonly rank: number;
  readonly iconUrl: string;
  readonly accentColor: string | null;
  readonly price: number | null;
  readonly marketCap: number | null;
  readonly volume24h: number | null;
  readonly changePercent: number | null;
  readonly trend: PriceTrend;
  readonly sparkline: readonly number[];
  readonly listedAt: Date | null;
  readonly isLowVolume: boolean;
}

export interface CoinLink {
  readonly name: string;
  readonly type: string;
  readonly url: string;
}

export interface CoinSupply {
  readonly circulating: number | null;
  readonly total: number | null;
  readonly max: number | null;
  readonly circulatingRatio: number | null;
}

export interface CoinDetail extends Coin {
  readonly description: string;
  readonly websiteUrl: string | null;
  readonly links: readonly CoinLink[];
  readonly supply: CoinSupply;
  readonly allTimeHighPrice: number | null;
  readonly allTimeHighAt: Date | null;
  readonly numberOfMarkets: number | null;
  readonly numberOfExchanges: number | null;
  readonly fullyDilutedMarketCap: number | null;
}

export interface MarketStats {
  readonly matchingCoins: number;
  readonly totalCoins: number;
  readonly totalMarkets: number;
  readonly totalExchanges: number;
  readonly totalVolume24h: number | null;
}

export interface CoinPage {
  readonly coins: readonly Coin[];
  readonly stats: MarketStats;
}

export interface PricePoint {
  readonly price: number;
  readonly timestamp: Date;
}

export interface PriceHistory {
  readonly changePercent: number | null;
  readonly trend: PriceTrend;
  readonly points: readonly PricePoint[];
  readonly lowest: number | null;
  readonly highest: number | null;
}
