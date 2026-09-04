export interface CoinApiModel {
  uuid: string;
  symbol: string;
  name: string;
  color: string | null;
  iconUrl: string;
  marketCap: string | null;
  price: string | null;
  listedAt: number | null;
  change: string | null;
  rank: number;
  sparkline: (string | null)[] | null;
  coinrankingUrl: string;
  '24hVolume': string | null;
  tier?: number;
  lowVolume?: boolean;
}

export interface CoinLinkApiModel {
  name: string;
  type: string;
  url: string;
}

export interface CoinSupplyApiModel {
  confirmed: boolean;
  supplyAt: number | null;
  max: string | null;
  total: string | null;
  circulating: string | null;
}

export interface CoinDetailApiModel extends CoinApiModel {
  description: string | null;
  websiteUrl: string | null;
  links: CoinLinkApiModel[] | null;
  supply: CoinSupplyApiModel | null;
  allTimeHigh: { price: string | null; timestamp: number | null } | null;
  numberOfMarkets: number | null;
  numberOfExchanges: number | null;
  fullyDilutedMarketCap: string | null;
}

export interface MarketStatsApiModel {
  total: number;
  totalCoins: number;
  totalMarkets: number;
  totalExchanges: number;
  totalMarketCap: string | null;
  total24hVolume: string | null;
}

export interface CoinListApiResponse {
  status: string;
  data: {
    stats: MarketStatsApiModel;
    coins: CoinApiModel[];
  };
}

export interface CoinDetailApiResponse {
  status: string;
  data: {
    coin: CoinDetailApiModel;
  };
}

export interface PriceHistoryApiResponse {
  status: string;
  data: {
    change: string | null;
    history: { price: string | null; timestamp: number }[];
  };
}
