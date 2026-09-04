import { HttpContext, HttpContextToken } from '@angular/common/http';

export type CachePolicy = 'prefer-cache' | 'revalidate';

export const HTTP_CACHE_TTL_MS = 60_000;

export const CACHE_POLICY = new HttpContextToken<CachePolicy>(() => 'prefer-cache');

export function withCachePolicy(policy: CachePolicy): HttpContext {
  return new HttpContext().set(CACHE_POLICY, policy);
}
