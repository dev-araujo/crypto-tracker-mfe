import { InjectionToken, Provider } from '@angular/core';
import { CoinApiService } from '../services/coin-api.service';

export interface CryptoApiConfig {
  readonly baseUrl: string;
}

export const CRYPTO_API_CONFIG = new InjectionToken<CryptoApiConfig>('CRYPTO_API_CONFIG');

export function provideCryptoApi(config: CryptoApiConfig): Provider[] {
  return [{ provide: CRYPTO_API_CONFIG, useValue: config }, CoinApiService];
}
