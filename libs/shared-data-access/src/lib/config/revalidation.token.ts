import { InjectionToken, Provider } from '@angular/core';
import { RevalidationScheduler } from '../revalidation/revalidation.scheduler';

export interface RevalidationConfig {
  readonly intervalMs: number;
}

export const DEFAULT_REVALIDATION_INTERVAL_MS = 120_000;

export const REVALIDATION_CONFIG = new InjectionToken<RevalidationConfig>('REVALIDATION_CONFIG', {
  providedIn: 'root',
  factory: () => ({ intervalMs: DEFAULT_REVALIDATION_INTERVAL_MS }),
});

export function provideRevalidation(config: RevalidationConfig): Provider[] {
  return [{ provide: REVALIDATION_CONFIG, useValue: config }, RevalidationScheduler];
}
