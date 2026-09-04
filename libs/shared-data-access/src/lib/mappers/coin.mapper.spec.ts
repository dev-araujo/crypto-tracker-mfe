import { CoinApiModel, PriceHistoryApiResponse } from '../models/coin-api.model';
import { toCoin, toPriceHistory, toTrend } from './coin.mapper';

function buildApiCoin(overrides: Partial<CoinApiModel> = {}): CoinApiModel {
  return {
    uuid: 'uuid-1',
    symbol: 'BTC',
    name: 'Bitcoin',
    color: '#f7931a',
    iconUrl: 'https://cdn.example/btc.svg',
    marketCap: '1000.5',
    price: '250.75',
    listedAt: 1279324800,
    change: '-2.5',
    rank: 1,
    sparkline: ['1', null, '3'],
    coinrankingUrl: 'https://coinranking.com/coin/uuid-1',
    '24hVolume': '900',
    ...overrides,
  };
}

describe('toCoin', () => {
  it('converts numeric strings into numbers', () => {
    const coin = toCoin(buildApiCoin());

    expect(coin.price).toBe(250.75);
    expect(coin.marketCap).toBe(1000.5);
    expect(coin.volume24h).toBe(900);
  });

  it('drops invalid sparkline entries', () => {
    expect(toCoin(buildApiCoin()).sparkline).toEqual([1, 3]);
  });

  it('derives the trend from the change', () => {
    expect(toCoin(buildApiCoin()).trend).toBe('down');
    expect(toCoin(buildApiCoin({ change: '3.1' })).trend).toBe('up');
    expect(toCoin(buildApiCoin({ change: null })).trend).toBe('flat');
  });

  it('converts the listing timestamp into a date', () => {
    expect(toCoin(buildApiCoin()).listedAt?.getUTCFullYear()).toBe(2010);
  });
});

describe('toPriceHistory', () => {
  it('sorts points chronologically and exposes the range', () => {
    const response: PriceHistoryApiResponse = {
      status: 'success',
      data: {
        change: '1.5',
        history: [
          { price: '30', timestamp: 300 },
          { price: '10', timestamp: 100 },
          { price: null, timestamp: 200 },
        ],
      },
    };

    const history = toPriceHistory(response);

    expect(history.points.map((point) => point.price)).toEqual([10, 30]);
    expect(history.lowest).toBe(10);
    expect(history.highest).toBe(30);
    expect(history.trend).toBe('up');
  });
});

describe('toTrend', () => {
  it('treats negligible variations as flat', () => {
    expect(toTrend(0.001)).toBe('flat');
  });
});
