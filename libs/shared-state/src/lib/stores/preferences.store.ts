import { Injectable, computed, signal } from '@angular/core';
import {
  DEFAULT_REFERENCE_CURRENCY,
  ReferenceCurrency,
  findReferenceCurrencyByCode,
} from '@crypto/shared-data-access';
import { readStoredValue, writeStoredValue } from '@crypto/shared-utils';
import { ThemeMode } from '../models/theme.model';

const CURRENCY_STORAGE_KEY = 'crypto.preferences.currency';
const THEME_STORAGE_KEY = 'crypto.preferences.theme';

@Injectable({ providedIn: 'root' })
export class PreferencesStore {
  private readonly _currency = signal<ReferenceCurrency>(this.restoreCurrency());
  private readonly _theme = signal<ThemeMode>(this.restoreTheme());

  readonly currency = this._currency.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly currencyCode = computed(() => this._currency().code);
  readonly currencyUuid = computed(() => this._currency().uuid);

  setCurrency(currency: ReferenceCurrency): void {
    this._currency.set(currency);
    writeStoredValue(CURRENCY_STORAGE_KEY, currency.code);
  }

  setCurrencyByCode(code: string): void {
    this.setCurrency(findReferenceCurrencyByCode(code));
  }

  toggleTheme(): void {
    this.setTheme(this._theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode): void {
    this._theme.set(theme);
    writeStoredValue(THEME_STORAGE_KEY, theme);
  }

  private restoreCurrency(): ReferenceCurrency {
    const storedCode = readStoredValue<string | null>(CURRENCY_STORAGE_KEY, null);

    return storedCode === null
      ? DEFAULT_REFERENCE_CURRENCY
      : findReferenceCurrencyByCode(storedCode);
  }

  private restoreTheme(): ThemeMode {
    const storedTheme = readStoredValue<ThemeMode | null>(THEME_STORAGE_KEY, null);

    return storedTheme ?? this.systemTheme();
  }

  private systemTheme(): ThemeMode {
    const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches === true;

    return prefersDark ? 'dark' : 'light';
  }
}
