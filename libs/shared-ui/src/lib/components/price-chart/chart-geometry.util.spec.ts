import { buildTicks, pickLabelIndexes, resolveBounds } from './chart-geometry.util';

describe('resolveBounds', () => {
  it('pads the range around the observed values', () => {
    const bounds = resolveBounds([10, 20]);

    expect(bounds.lowest).toBeLessThan(10);
    expect(bounds.highest).toBeGreaterThan(20);
  });

  it('stays usable for an empty series', () => {
    expect(resolveBounds([])).toEqual({ lowest: 0, highest: 1 });
  });
});

describe('buildTicks', () => {
  it('spreads the requested number of ticks across the bounds', () => {
    const ticks = buildTicks({ lowest: 0, highest: 100 }, 5);

    expect(ticks).toEqual([0, 25, 50, 75, 100]);
  });
});

describe('pickLabelIndexes', () => {
  it('returns every index when the series is short', () => {
    expect(pickLabelIndexes(3, 6)).toEqual([0, 1, 2]);
  });

  it('samples evenly for long series', () => {
    expect(pickLabelIndexes(11, 3)).toEqual([0, 5, 10]);
  });
});
