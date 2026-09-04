import { PriceHistory } from '@crypto/shared-data-access';
import { mapHistoryToSeries } from './chart-series.mapper';

describe('mapHistoryToSeries', () => {
  it('returns an empty series when there is no history', () => {
    expect(mapHistoryToSeries(null)).toEqual([]);
  });

  it('converts domain points into chart points', () => {
    const history: PriceHistory = {
      changePercent: 1,
      trend: 'up',
      lowest: 10,
      highest: 20,
      points: [
        { price: 10, timestamp: new Date('2026-01-01T00:00:00Z') },
        { price: 20, timestamp: new Date('2026-01-02T00:00:00Z') },
      ],
    };

    expect(mapHistoryToSeries(history)).toEqual([
      { timestamp: Date.UTC(2026, 0, 1), value: 10 },
      { timestamp: Date.UTC(2026, 0, 2), value: 20 },
    ]);
  });
});
