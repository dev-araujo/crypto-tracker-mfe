import { formatCompactNumber, formatDecimal, formatPercent } from './number.formatter';
import { EMPTY_VALUE } from '../constants/locale.constant';

describe('number formatters', () => {
  it('formats a positive change with an explicit sign', () => {
    expect(formatPercent(4.5)).toBe('+4,50%');
  });

  it('formats a negative change keeping the minus sign', () => {
    expect(formatPercent(-1.234)).toBe('-1,23%');
  });

  it('falls back to the empty marker for missing values', () => {
    expect(formatPercent(null)).toBe(EMPTY_VALUE);
    expect(formatCompactNumber(undefined)).toBe(EMPTY_VALUE);
    expect(formatDecimal(Number.NaN)).toBe(EMPTY_VALUE);
  });

  it('compacts large numbers', () => {
    expect(formatCompactNumber(1_500_000_000)).toContain('bi');
  });
});
