import { PriceHistory } from '@crypto/shared-data-access';
import { ChartPoint } from '@crypto/shared-ui';

export function mapHistoryToSeries(history: PriceHistory | null): readonly ChartPoint[] {
  if (history === null) {
    return [];
  }

  return history.points.map((point) => ({
    timestamp: point.timestamp.getTime(),
    value: point.price,
  }));
}
