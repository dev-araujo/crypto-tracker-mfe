import { ReferenceCurrency } from '../models/reference-currency.model';

export const REFERENCE_CURRENCIES: readonly ReferenceCurrency[] = [
  { uuid: 'n5fpnvMGNsOS', code: 'BRL', sign: 'R$', label: 'Real brasileiro' },
  { uuid: 'yhjMzLPhuIDl', code: 'USD', sign: '$', label: 'Dólar americano' },
  { uuid: '5k-_VTxqtCEI', code: 'EUR', sign: '€', label: 'Euro' },
  { uuid: 'Hokyui45Z38f', code: 'GBP', sign: '£', label: 'Libra esterlina' },
];

export const DEFAULT_REFERENCE_CURRENCY = REFERENCE_CURRENCIES[0];

export function findReferenceCurrencyByCode(code: string): ReferenceCurrency {
  return (
    REFERENCE_CURRENCIES.find((currency) => currency.code === code) ?? DEFAULT_REFERENCE_CURRENCY
  );
}
