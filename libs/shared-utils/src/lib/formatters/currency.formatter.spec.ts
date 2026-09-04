import { formatCurrency } from './currency.formatter';

describe('formatCurrency', () => {
  it('uses two decimals for values above one unit', () => {
    expect(formatCurrency(1234.5678, 'BRL')).toContain('1.234,57');
  });

  it('extends precision for sub-cent values', () => {
    expect(formatCurrency(0.00012345, 'BRL')).toContain('0,00012345');
  });

  it('keeps two decimals for zero', () => {
    expect(formatCurrency(0, 'USD')).toContain('0,00');
  });
});
