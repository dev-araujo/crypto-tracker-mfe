export interface ChartPoint {
  readonly timestamp: number;
  readonly value: number;
}

export interface PlottedPoint {
  readonly x: number;
  readonly y: number;
  readonly point: ChartPoint;
  readonly index: number;
}

export interface ChartBounds {
  readonly lowest: number;
  readonly highest: number;
}

const VERTICAL_PADDING_RATIO = 0.08;

export function resolveBounds(values: readonly number[]): ChartBounds {
  if (values.length === 0) {
    return { lowest: 0, highest: 1 };
  }

  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const spread = highest - lowest || Math.abs(highest) * VERTICAL_PADDING_RATIO || 1;
  const padding = spread * VERTICAL_PADDING_RATIO;

  return { lowest: lowest - padding, highest: highest + padding };
}

export function buildLinePath(plotted: readonly PlottedPoint[]): string {
  return plotted
    .map((item, index) => `${index === 0 ? 'M' : 'L'} ${round(item.x)} ${round(item.y)}`)
    .join(' ');
}

export function buildAreaPath(plotted: readonly PlottedPoint[], baseline: number): string {
  if (plotted.length < 2) {
    return '';
  }

  const first = plotted[0];
  const last = plotted[plotted.length - 1];

  return `${buildLinePath(plotted)} L ${round(last.x)} ${round(baseline)} L ${round(first.x)} ${round(baseline)} Z`;
}

export function buildTicks(bounds: ChartBounds, count: number): readonly number[] {
  const step = (bounds.highest - bounds.lowest) / (count - 1);

  return Array.from({ length: count }, (_, index) => bounds.lowest + step * index);
}

export function pickLabelIndexes(total: number, desired: number): readonly number[] {
  if (total <= desired) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const step = (total - 1) / (desired - 1);

  return Array.from({ length: desired }, (_, index) => Math.round(index * step));
}

function round(value: number): number {
  return Number(value.toFixed(2));
}
